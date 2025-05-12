import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface WorkoutInput {
    height: number; // in feet
    weight: number; // in pounds
    experience: 'novice' | 'intermediate' | 'advanced';
    goal: string;
}

interface WorkoutPlan {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
}

export async function generateAIWorkoutPlan(input: WorkoutInput): Promise<WorkoutPlan> {
    const prompt = `Create a personalized 5-day workout plan for someone with the following characteristics:
    - Height: ${input.height} feet
    - Weight: ${input.weight} pounds
    - Experience Level: ${input.experience}
    - Goal: ${input.goal}

    Please provide a structured workout plan with specific exercises, sets, reps, and rest periods for each day.
    Format the response as a JSON object with monday, tuesday, wednesday, thursday, and friday fields.
    
    IMPORTANT: Each day should be a detailed TEXT STRING with 4-6 exercises (not an object).
    For example: "1. Bench Press: 3 sets x 10 reps, 60 sec rest. 2. Squats: 4 sets x 8 reps, 90 sec rest..." and so on.
    
    DO NOT use nested objects for the exercises - just well-formatted text.`;

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert fitness trainer and workout program designer. Create detailed, safe, and effective workout plans based on user characteristics."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "gpt-3.5-turbo",
            response_format: { type: "json_object" }
        });

        const response = completion.choices[0].message.content;
        if (!response) {
            throw new Error('No response from AI model');
        }

        // Ensure we return a plain object by parsing and re-serializing
        const plainObject = JSON.parse(response);
        
        // Ensure the returned object has the expected structure with proper string formatting
        const sanitizedWorkoutPlan: WorkoutPlan = {
            monday: typeof plainObject.monday === 'object' ? JSON.stringify(plainObject.monday) : String(plainObject.monday || ''),
            tuesday: typeof plainObject.tuesday === 'object' ? JSON.stringify(plainObject.tuesday) : String(plainObject.tuesday || ''),
            wednesday: typeof plainObject.wednesday === 'object' ? JSON.stringify(plainObject.wednesday) : String(plainObject.wednesday || ''),
            thursday: typeof plainObject.thursday === 'object' ? JSON.stringify(plainObject.thursday) : String(plainObject.thursday || ''),
            friday: typeof plainObject.friday === 'object' ? JSON.stringify(plainObject.friday) : String(plainObject.friday || '')
        };

        return sanitizedWorkoutPlan;
    } catch (error) {
        console.error('Error generating workout plan:', error);
        throw error;
    }
} 