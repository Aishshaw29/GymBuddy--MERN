import express from 'express';
import Workout from '../models/Workout.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require USER role authentication
router.use(verifyToken);
router.use(requireRole('USER'));

/**
 * @route   POST /api/workouts
 * @desc    Add a new workout log
 * @access  Private (USER only)
 */
router.post('/', async (req, res) => {
    try {
        const { date, exerciseName, workoutType, sets, reps, weight, duration, caloriesBurned, notes } = req.body;

        const workout = new Workout({
            userId: req.user._id,
            date: date || new Date(),
            exerciseName,
            workoutType,
            sets,
            reps,
            weight,
            duration,
            caloriesBurned,
            notes
        });

        await workout.save();

        res.status(201).json({
            success: true,
            message: 'Workout logged successfully.',
            workout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to log workout.',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/workouts
 * @desc    Get all workouts for current user
 * @access  Private (USER only)
 */
router.get('/', async (req, res) => {
    try {
        const { startDate, endDate, workoutType } = req.query;

        let query = { userId: req.user._id };

        // Add date range filter if provided
        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        // Add workout type filter if provided
        if (workoutType) {
            query.workoutType = workoutType;
        }

        const workouts = await Workout.find(query).sort({ date: -1 });

        res.json({
            success: true,
            count: workouts.length,
            workouts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get workouts.',
            error: error.message
        });
    }
});

/**
 * @route   GET /api/workouts/analytics
 * @desc    Get workout analytics (weekly/monthly)
 * @access  Private (USER only)
 */
router.get('/analytics', async (req, res) => {
    try {
        const { period = 'week' } = req.query;

        // Calculate date range
        const now = new Date();
        const startDate = new Date();

        if (period === 'week') {
            startDate.setDate(now.getDate() - 7);
        } else if (period === 'month') {
            startDate.setDate(now.getDate() - 30);
        }

        const workouts = await Workout.find({
            userId: req.user._id,
            date: { $gte: startDate, $lte: now }
        }).sort({ date: 1 });

        // Calculate analytics
        const totalWorkouts = workouts.length;
        const totalCaloriesBurned = workouts.reduce((sum, w) => sum + (w.caloriesBurned || 0), 0);

        // Group by date for charts
        const workoutsByDate = {};
        const caloriesByDate = {};

        workouts.forEach(workout => {
            const dateKey = workout.date.toISOString().split('T')[0];
            workoutsByDate[dateKey] = (workoutsByDate[dateKey] || 0) + 1;
            caloriesByDate[dateKey] = (caloriesByDate[dateKey] || 0) + (workout.caloriesBurned || 0);
        });

        // Calculate streak
        let currentStreak = 0;
        let longestStreak = 0;
        let streak = 0;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dateKey = checkDate.toISOString().split('T')[0];

            if (workoutsByDate[dateKey]) {
                streak++;
                if (i === 0 || currentStreak > 0) currentStreak = streak;
                longestStreak = Math.max(longestStreak, streak);
            } else {
                if (i > 0) break;
                streak = 0;
            }
        }

        res.json({
            success: true,
            analytics: {
                period,
                totalWorkouts,
                totalCaloriesBurned,
                currentStreak,
                longestStreak,
                workoutsByDate,
                caloriesByDate,
                workouts
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to get analytics.',
            error: error.message
        });
    }
});

/**
 * @route   DELETE /api/workouts/:id
 * @desc    Delete a workout
 * @access  Private (USER only)
 */
router.delete('/:id', async (req, res) => {
    try {
        const workout = await Workout.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!workout) {
            return res.status(404).json({
                success: false,
                message: 'Workout not found.'
            });
        }

        await workout.deleteOne();

        res.json({
            success: true,
            message: 'Workout deleted successfully.'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete workout.',
            error: error.message
        });
    }
});

export default router;
