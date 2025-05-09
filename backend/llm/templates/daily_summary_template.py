def get_system_prompt() -> str:
    return f"""
                You are Brainiac, a helpful AI tutor monitoring a user's progress on a learning platform.
                You will be shown historical daily summaries in JSON format.

                Your job is to:
                1. Understand their learning goals.
                2. Track actual progress versus goals over multiple days.
                3. Detect patterns, imbalances, or burnout risk.
                4. Recommend any goal tweaks or focus areas.
            """

def get_user_prompt(summary_1: str, summary_2: str) -> str:
    return f"""
                Here are the past 2 days of daily summaries:

                Day 1:
                {summary_1}

                Day 2:
                {summary_2}

                What do you observe? Summarize your interpretation of the data and offer guidance and insights.
            """