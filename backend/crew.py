from crewai import Agent, Crew, Process, Task, LLM
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from crewai.knowledge.source.crew_docling_source import CrewDoclingSource
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource

llm = LLM(
    model="openai/gpt-4o-mini", # call model by provider/model_name
    # model="gemini/gemini-1.5-flash",
    temperature = 0.7
)

content_source = CrewDoclingSource(
    file_paths=[
        "https://pitch-medicine-b79.notion.site/ca1e6306c4554d11b329730120c361e5?v=0f6d4399195248759dc557909b9f8c66",
    ],
)

pdf_source = PDFKnowledgeSource(
    file_paths=["골관절염.pdf",
                "Hyaluronic acid injection_severity.pdf",
                "NSAIDs_severity.pdf",
                "Steroid injection_severity.pdf",
                "TKRA_severity.pdf"]
)

class CrewInput(BaseModel):
    initial_message: str = Field(..., description="Initial message from the person")
    background_info: str = Field(..., description="환자 기본 정보 및 진료 데이터")
    
class SymptomInformationOutput(BaseModel):
    symptom: str = Field(default="UNKNOWN", description="증상 명칭")
    onset: str = Field(default="UNKNOWN", description="증상 발생 시점")
    location: str = Field(default="UNKNOWN", description="증상 발생 위치")
    duration: str = Field(default="UNKNOWN", description="증상의 지속 시간")
    course: str = Field(default="UNKNOWN", description="증상의 경과 (점점 심해지는지, 반복되는지 등)")
    character: str = Field(default="UNKNOWN", description="증상의 자세한 특성 (통증의 양상 등)")
    associated_symptom: str = Field(default="UNKNOWN", description="동반 증상 (발열, 오한, 피로 등)")
    factor: str = Field(default="UNKNOWN", description="완화인자/악화인자")

def ask_human(question) -> str:
    return input(f"\n[AI] {question}\n> ")

class HumanInputContextToolSchema(BaseModel):
    question: str

class HumanInputContextTool(BaseTool):
    name: str = "Ask Human follow up questions to get additional context"
    description: str = (
        "Use this tool to ask follow-up questions to the human in case additional context is needed. "
        "You can pass the question argument in any form (raw string or dictionary or list) "
        "and I will sanitize it to ask the human."
    )
    args_schema = HumanInputContextToolSchema

    def _run(self, question) -> str:
        # 방탄 처리
        cleaned_question = self._clean_question(question)
        return ask_human(cleaned_question)

    def _clean_question(self, question) -> str:
        """
        어떤 형식이 들어와도 문자열로 변환
        """
        import json

        if isinstance(question, str):
            return question.strip()

        elif isinstance(question, dict):
            # 가장 흔히 오는 {"description": "..."} 형태
            return question.get("description", str(question))

        elif isinstance(question, list):
            return " / ".join(str(q) for q in question)

        else:
            try:
                return json.dumps(question)
            except:
                return str(question)
            
human_tool = HumanInputContextTool()

class Piethon2():
    """Piethon2 crew"""
    def agent_ask(self) -> Agent:
        return Agent(
            role=(
                "당신은 임상 병력 청취와 환자 커뮤니케이션에 특화된 숙련된 간호사입니다. "
                "당신의 역할은 다중턴 대화를 통해 환자에게 증상과 관련된 핵심 정보를 구조적이고 전문적으로 수집하는 것입니다. "
                "환자의 배경 정보는 다음과 같습니다: {background_info}. "
                "이 배경 정보를 반드시 참고하여, 불필요한 질문을 줄이고 필요한 항목만 보완적으로 탐색하세요. "
                "수집할 항목은 다음과 같습니다: 증상(Symptom), 발현 시점(Onset), 발생 부위(Location), "
                "지속 시간(Duration), 경과(Course), 특성(Character), 동반 증상(Associated symptom), 완화·악화 요인(Factor)."
            ),
            goal=(
                "당신의 목표는 위의 항목을 모두 포함하는 구조화된 증상 보고서를 작성하는 것입니다. "
                "환자의 배경 정보({background_info})를 고려하여, 이미 파악된 내용에 대해 중복 질문을 하지 말고 "
                "필요한 추가 설명만 요청하십시오. "
                "최종적으로는 수집한 데이터를 JSON 형식으로 출력해야 합니다. "
                "환자가 다음과 같이 말했습니다: {initial_message}"
            ),
            backstory=(
                "당신은 풍부한 임상경험을 가진 등록 간호사이며, "
                "정형외과 외래 환자의 사전 병력 정보를 빠르게 파악하고 대화를 맞춤화할 수 있는 능력을 보유하고 있습니다. "
                "환자의 배경({background_info})을 바탕으로, 신뢰감 있고 공감적인 태도로 필요한 정보를 빠짐없이 수집합니다."
            ),
            tools=[human_tool],
            verbose=True,
            llm=llm
        )

    def agent_diagnosis(self) -> Agent:
        return Agent(
            role="Medical Diagnostician",
            goal=(
                "Synthesize patient data—including demographic info, initial complaint and treatment, treatment intent, "
                "KL grade, and current post-treatment issues—into a structured differential diagnosis. "
                "Rank possible diagnoses in order of likelihood, explain the clinical context of the current situation, "
                "and provide medically sound reasoning. Do not provide a final confirmed diagnosis, but offer a clear explanation "
                "of the problem and potential directions for further action."
            ),
            backstory=(
                "You are a seasoned clinician specializing in musculoskeletal conditions. The patient you're assessing has already received "
                "an initial consultation and treatment (e.g., steroid injection, hyaluronic acid injection, NSAID, or surgery). "
                "Your role is to interpret the new problem that occurred *after* this initial intervention. "
                "You have access to the patient's basic information (age, sex), the primary complaint at first visit, the treatment received, "
                "its medical purpose, the KL grade, and the detailed dialogue about the issue that followed. "
                "Using this information, your job is to help explain the nature of the current complication or symptom flare, "
                "propose likely clinical causes, and highlight any red flags that may need further intervention."
            ),
            verbose=True,
            llm = llm
        )

    def agent_tell(self) -> Agent:
        return Agent(
            role="Patient Communicator",
            goal="Send diagnosis & action plan back to patient",
            backstory="Convert medical insights into simple guidance",
            verbose=True,
            llm = llm
        )
        
    def agent_alert(self) -> Agent:
        return Agent(
            role="Emergency Risk Assessor",
            goal=(
                "Thoroughly analyze the patient’s condition using all available data to classify the situation as "
                "Green, Yellow, or Red. Carefully evaluate the current medical state with clinical reasoning. "
                "Green: no treatment required, observation is sufficient. "
                "Yellow: not urgent but requires follow-up if symptoms worsen. "
                "Red: immediate medical attention needed. "
                "Your classification must be based on integrated clinical logic and conservative medical judgment."
            ),
            backstory=(
                "You are a clinical triage specialist responsible for identifying red-flag symptoms and assessing emergency risk levels. "
                "The patient has already undergone an initial consultation and received treatment (e.g., injection, NSAIDs, surgery). "
                "You have access to the patient's sex, age, KL grade, initial symptoms, treatment and its purpose, the complication or issue "
                "that occurred after treatment, the detailed symptom description obtained through a medical dialogue, and the analysis result from the Diagnosis Agent. "
                "Your task is to synthesize this information into a clinically sound risk assessment. "
                "The stakes are high: a false Red may cause patient anxiety, while a missed Red may result in clinical deterioration. "
                "Your classification must balance caution with clinical relevance, and should be explainable with medical rationale."
            ),
            verbose=True,
            llm = llm,
            knowledge_sources=[pdf_source]
        )
        
    def agent_doctor_summary(self) -> Agent:
        return Agent(
            role="Medical Summary Specialist",
            goal="Provide concise, structured, and clinically relevant summaries tailored for physician review in EMR systems",
            backstory="""
            As an experienced clinical assistant familiar with EMR standards, you specialize in synthesizing patient-reported data, diagnostic insights, and clinical recommendations into structured, physician-friendly summaries. 
            Your reports enable swift decision-making and facilitate efficient follow-up actions. You emphasize clarity, brevity, medical accuracy, and actionable insights, ensuring summaries integrate seamlessly with hospital EMR workflows.
            """,
            verbose=True,
            llm = llm
        )

    def task_ask_and_query(self) -> Task:
        return Task(
            name="증상 정보 수집",
            description=(
                "환자와의 다중턴 대화를 통해 증상에 대한 구체적이고 체계적인 정보를 수집하세요. "
                "다음 항목을 반드시 포함해야 합니다: 증상(Symptom), 증상 발생 시점(Onset), 발생 부위(Location), "
                "지속 시간(Duration), 증상의 경과(Course), 증상의 특성(Character), 동반 증상(Associated symptom), "
                "완화·악화 요인(Factor). "
                "환자와의 대화를 통해 이 모든 요소가 채워질 수 있는지를 항상 확인합니다. "
                "만약 환자의 설명에 누락되거나 불분명한 부분이 있다면, 자연스럽고 공감적인 간호사 어투로 추가 질문을 통해 보완하십시오. "
                "환자가 이미 언급한 항목에 대해서는 같은 내용을 반복해 묻지 말고, 누락되거나 추가 설명이 필요한 부분만 자연스럽게 질문하세요. "
                "모든 정보는 의료진이 즉시 활용할 수 있을 정도로 구체적이고 명확해야 합니다."
            ),
            expected_output=(
                "다음 키를 포함한 유효한 JSON 객체를 출력합니다: symptom, onset, location, duration, course, character, "
                "associated_symptom, factor. 마크다운 코드 블록이나 부가 설명은 출력하지 말고, "
                "JSON 객체만 최종적으로 제시하세요. "
                "모든 키에는 반드시 값이 채워져 있어야 합니다."
            ),
            output_json=SymptomInformationOutput,
            agent=self.agent_ask(),
            human_input=False
        )

    def task_diagnose(self) -> Task:
        return Task(
            description=(
                "Using the patient's age, sex, initial complaint and treatment, treatment goal, KL grade, "
                "details of post-treatment issues, and the follow-up conversation with the patient, "
                "analyze the situation from a clinical perspective. Generate a differential diagnosis ranked by likelihood, "
                "explain the clinical scenario in detail, and infer likely medical causes. "
                "Do not finalize a diagnosis; instead, present possible explanations and next-step recommendations. "
                "The patient already received initial care and is now reporting new or worsening issues. "
                "Your goal is to assess the cause of these post-treatment symptoms and inform the next best clinical action."
            ),
            expected_output=(
                "A dictionary with the following fields:\n"
                "- differential_diagnosis: list of possible diagnoses with likelihood and justification\n"
                "- clinical_summary: overall interpretation of the current condition\n"
                "- red_flags: list of any critical warning signs\n"
                "- recommendations: next-step suggestions for clinicians"
            ),
            agent=self.agent_diagnosis(),
            context = [self.task_ask_and_query()]
        )

    def task_tell_patient(self) -> Task:
        return Task(
            description=(
                "Review the patient’s demographic info (age, sex), initial symptoms, treatment and its intent, KL grade, "
                "post-treatment symptom details, follow-up dialogue, and the diagnosis agent’s output. "
                "Using all of this information, classify the patient's current risk level into one of three categories:\n"
                "- Green: no immediate treatment needed, safe for observation.\n"
                "- Yellow: not urgent now, but requires monitoring or clinic visit if symptoms worsen.\n"
                "- Red: urgent, patient must seek medical care immediately.\n"
                "Base your classification on clinical reasoning and medical red flag thresholds. "
                "Err on the side of caution, but avoid false alarms. Justify your decision with concise medical rationale."
            ),
            expected_output=(
                "A dictionary with the following fields:\n"
                "- severity_level: one of ['green', 'yellow', 'red']\n"
                "- reasoning: clinical explanation of why this level was assigned\n"
                "- next_steps: patient or doctor-facing recommendations based on severity"
            ),
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
            description="""
            Generate a structured, EMR-ready summary for physician review based on comprehensive patient interaction data, including:
            - Patient demographics and relevant medical history
            - Chief complaints and detailed symptom characterization
            - Diagnostic agent’s analysis and suggested diagnosis probabilities
            - Actionable recommendations including potential next steps and follow-up plans
            - Urgency indicators derived from Alert Agent analysis
            """,
            expected_output="""
            A concise, structured summary including:
            1. Patient Summary:
            - Age, Gender, Diagnosis history, Relevant procedures (e.g., previous knee surgery, injections)
            2. Chief Complaints:
            - Primary symptom (e.g., knee pain, swelling, reduced mobility)
            - Symptom duration, intensity, changes over time
            3. Diagnostic Insights:
            - Most probable diagnosis (e.g., septic arthritis 82%, reactive arthritis 11%)
            - Important symptom-diagnosis relationships identified by the Diagnosis Agent
            4. Recommended Clinical Actions:
            - Immediate actions required (if any)
            - Suggested follow-up schedule (e.g., clinic visit tomorrow)
            - Recommended patient management and treatment guidance (e.g., pain management protocol, icing frequency)
            5. Alert Level:
            - Clearly marked alert status (Red, Yellow, Green) and rationale for urgency level
            """,
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
            verbose=False,
            memory=False
        )

if __name__ == "__main__":
    initial = input("\n[System] Please start by introducing symptom:\n> ")
    TEXT = ("62세 여성, 3개월 전 양측 무릎 관절염(KL 2~3단계) 진단, 좌측 더 심함, HKA: 우측 varus 4도, 좌측 7도"
            "6개월 지속형 연골주사 치료 중 (좌우 모두), 어제 주사 맞음")
            
    input_data = CrewInput(initial_message=initial,background_info=TEXT)

    try:
        Piethon2().crew().kickoff(inputs=input_data.model_dump())
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")
