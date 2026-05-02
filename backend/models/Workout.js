import mongoose from 'mongoose';

const workoutSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    exerciseName: {
        type: String,
        required: [true, 'Exercise name is required'],
        trim: true
    },
    workoutType: {
        type: String,
        enum: ['strength', 'cardio', 'flexibility'],
        required: true
    },
    sets: {
        type: Number,
        min: 0,
        default: 0
    },
    reps: {
        type: Number,
        min: 0,
        default: 0
    },
    weight: {
        type: Number,
        min: 0,
        default: 0,
        // Weight in kg
    },
    duration: {
        type: Number,
        min: 0,
        default: 0,
        // Duration in minutes
    },
    caloriesBurned: {
        type: Number,
        min: 0,
        default: 0
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index for faster queries
workoutSchema.index({ userId: 1, date: -1 });

const Workout = mongoose.model('Workout', workoutSchema);

export default Workout;
