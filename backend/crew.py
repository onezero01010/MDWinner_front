from crewai import Agent, Crew, Process, Task
from pydantic import BaseModel, Field
from crewai.knowledge.source.crew_docling_source import CrewDoclingSource
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource

content_source = CrewDoclingSource(
    file_paths=[
        "https://pitch-medicine-b79.notion.site/ca1e6306c4554d11b329730120c361e5?v=0f6d4399195248759dc557909b9f8c66",
    ],
)

pdf_source = PDFKnowledgeSource(
    file_paths=["knw/골관절염.pdf",
                "knw/Hyaluronic acid injection_severity.pdf",
                "knw/NSAIDs_severity.pdf",
                "knw/Steroid injection_severity.pdf",
                "knw/TKRA_severity.pdf"]
)

class CrewInput(BaseModel):
    initial_message: str = Field(..., description="Initial message from the person")

class Piethon2():
    """Piethon2 crew"""
    def agent_ask(self) -> Agent:
        return Agent(
            role="Patient Interviewer",
            goal="Gather patient information via {initial_message}",
            backstory="Engage with the patient to collect missing medical details",
            verbose=True
        )

    def agent_diagnosis(self) -> Agent:
        return Agent(
            role="Medical Diagnostician",
            goal="Analyze patient data and provide diagnosis & insight",
            backstory="Leverage clinical models to infer conditions",
            verbose=True
        )

    def agent_tell(self) -> Agent:
        return Agent(
            role="Patient Communicator",
            goal="Send diagnosis & action plan back to patient",
            backstory="Convert medical insights into simple guidance",
            verbose=True
        )
        
    def agent_alert(self) -> Agent:
        return Agent(
            role="Emergency Notifier",
            goal="Detect critical conditions and notify doctor immediately",
            backstory="Monitor for red-flag thresholds",
            verbose=True
        )
        
    def agent_doctor_summary(self) -> Agent:
        return Agent(
            role="EMR Summarizer",
            goal="Convert diagnosis & insight into an EMR-compatible summary",
            backstory="Summarize findings in physician-friendly format",
            verbose=True
        )

    def task_ask_and_query(self) -> Task:
        return Task(
            description="Produce a structured query based on {initial_message}",
            expected_output="dict (structured query)",
            agent=self.agent_ask()
        )

    def task_diagnose(self) -> Task:
        return Task(
            description="Run medical inference on integrated patient data",
            expected_output="dict (diagnosis & insight)",
            agent=self.agent_diagnosis(),
            context = [self.task_ask_and_query()]
        )

    def task_tell_patient(self) -> Task:
        return Task(
            description="Generate and send patient-friendly message & action plan",
            expected_output="str (message to patient)",
            agent=self.agent_tell(),
            context = [self.task_diagnose()]
        )
        
    def task_send_alert(self) -> Task:
        return Task(
            description="Check for critical flags and send Red Alert to doctor",
            expected_output="None",
            agent=self.agent_alert(),
            context = [self.task_diagnose()],
            knowledge_sources=[pdf_source]
        )
        
    def task_summarize_for_doctor(self) -> Task:
        return Task(
            description="Create EMR-ready summary for the doctor",
            expected_output="str (EMR summary)",
            agent=self.agent_doctor_summary(),
            context = [self.task_diagnose()]
        )

    def crew(self) -> Crew:
        return Crew(
            agents=[
                self.agent_ask(),
                self.agent_diagnosis(),
                self.agent_tell(),
                self.agent_alert(),
                self.agent_doctor_summary(),
            ],
            tasks=[
                self.task_ask_and_query(),
                self.task_diagnose(),
                self.task_tell_patient(),
                self.task_send_alert(),
                self.task_summarize_for_doctor(),
            ],
            process=Process.sequential,
            verbose=True
        )

if __name__ == "__main__":
    """
    Run the crew.
    """
    input_data = CrewInput(initial_message="I hurt my knees")

    try:
        Piethon2().crew().kickoff(inputs=input_data.model_dump())
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")
