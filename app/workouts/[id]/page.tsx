import { getSpecificWorkout } from "@/database/queries";

function formatWorkoutDay(day: string): string {
    if (!day) return '';
    
    // Check if the day might be a stringified JSON object
    if (day.startsWith('{') || day.startsWith('[')) {
        try {
            const parsed = JSON.parse(day);
            if (typeof parsed === 'object') {
                // If it's an object, convert it to a formatted string
                return JSON.stringify(parsed, null, 2);
            }
        } catch (e) {
            // If it's not valid JSON, just return the original string
        }
    }
    
    // Return the string as is
    return day;
}

export default async function SpecificWorkout(
    { params }: {
        params: { id: string }
    },
) {
    const workout = await getSpecificWorkout(parseInt(params.id));

    return (
        workout ? (
            <section className="h-screen">
                <div className="max-w-screen-xl mx-auto px-6 py-24">
                    
                    <div className="mx-auto text-center">
                        <h2 className="text-4xl font-extrabold text-gray-900">
                            {workout.title}
                        </h2>
                        <h2 className="text-2xl font-bold text-gray-700">
                            {workout.createdAt.toLocaleString()}
                        </h2>
                    </div>

                    <div className="flow-root max-w-3xl mx-auto mt-16">
                        <div className="-my-4 divide-y divide-gray-700">
                            
                            <div className="flex py-4 gap-6 items-center">
                                <p className="w-32 text-lg font-normal sm:text-right text-gray-400 shrink-0">
                                    MONDAY
                                </p>
                                <h3 className="text-lg font-semibold text-gray-700">
                                    {formatWorkoutDay(workout.monday)}
                                </h3>
                            </div>
                            <div className="flex py-4 gap-6 items-center">
                                <p className="w-32 text-lg font-normal sm:text-right text-gray-400 shrink-0">
                                    TUESDAY
                                </p>
                                <h3 className="text-lg font-semibold text-gray-700">
                                    {formatWorkoutDay(workout.tuesday)}
                                </h3>
                            </div>
                            <div className="flex py-4 gap-6 items-center">
                                <p className="w-32 text-lg font-normal sm:text-right text-gray-400 shrink-0">
                                    WEDNESDAY
                                </p>
                                <h3 className="text-lg font-semibold text-gray-700">
                                    {formatWorkoutDay(workout.wednesday)}
                                </h3>
                            </div>
                            <div className="flex py-4 gap-6 items-center">
                                <p className="w-32 text-lg font-normal sm:text-right text-gray-400 shrink-0">
                                    THURSDAY
                                </p>
                                <h3 className="text-lg font-semibold text-gray-700">
                                    {formatWorkoutDay(workout.thursday)}
                                </h3>
                            </div>
                            <div className="flex py-4 gap-6 items-center">
                                <p className="w-32 text-lg font-normal sm:text-right text-gray-400 shrink-0">
                                    FRIDAY
                                </p>
                                <h3 className="text-lg font-semibold text-gray-700">
                                    {formatWorkoutDay(workout.friday)}
                                </h3>
                            </div>

                        </div>
                    </div>
                </div>
            </section>) : null
    );
}