from crewai import Agent, Crew, Process, Task, LLM
from crewai.tools import BaseTool
from pydantic import BaseModel, Field
from crewai.knowledge.source.crew_docling_source import CrewDoclingSource
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource
import os

llm = LLM(
    model="openai/gpt-4o-mini", # call model by provider/model_name
    # model="gemini/gemini-1.5-flash",
    temperature = 0.3
)

# tell_knowledge = CrewDoclingSource(
#     file_paths=[
#         "https://pitch-medicine-b79.notion.site/ca1e6306c4554d11b329730120c361e5?v=0f6d4399195248759dc557909b9f8c66",
#     ],
# )

# alert_knowledge = PDFKnowledgeSource(
#     file_paths=[
#         "alert/골관절염.pdf",
#         "alert/Hyaluronic acid injection_severity.pdf",
#         "alert/NSAIDs_severity.pdf",
#         "alert/Steroid injection_severity.pdf",
#         "alert/TKRA_severity.pdf"
#     ]
# )

# alert_knowledge = PDFKnowledgeSource(
#     file_paths = [os.path.join("alert", fname) for fname in os.listdir("knowledge/alert")]
# )

# diagnosis_knowledge = PDFKnowledgeSource(
#     file_paths = [os.path.join("diagnosis", fname) for fname in os.listdir("knowledge/diagnosis")]
# )

class CrewInput(BaseModel):
    initial_message: str = Field(..., description="Initial message from the person")
    background_info: str = Field(..., description="환자 기본 정보 및 진료 데이터")
    schedule_info: str = Field(..., description="예약 가능 날짜 및 예약 상태 데이터")
    
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
            role="Medical Diagnostician / 의료 진단 전문가",
            goal="""
            English: Synthesize patient data—including demographic info, initial complaint and treatment, treatment intent, 
            KL grade, and current post-treatment issues—into a structured differential diagnosis. 
            Rank possible diagnoses in order of likelihood, explain the clinical context of the current situation, 
            and provide medically sound reasoning. Do not provide a final confirmed diagnosis, but offer a clear explanation 
            of the problem and potential directions for further action.
            
            Korean: 인구통계학적 정보, 초기 증상 및 치료, 치료 목적, KL 등급, 현재 치료 후 문제점을 포함한 
            환자 데이터를 구조화된 감별진단으로 종합합니다. 가능한 진단을 가능성 순으로 순위를 매기고, 
            현재 상황의 임상적 맥락을 설명하며, 의학적으로 타당한 근거를 제시합니다. 
            최종 확진 진단을 제공하지 않고, 문제에 대한 명확한 설명과 추가 조치 방향을 제안합니다.
            """,
            backstory="""
            English: You are a seasoned clinician specializing in musculoskeletal conditions. The patient you're assessing has already received 
            an initial consultation and treatment (e.g., steroid injection, hyaluronic acid injection, NSAID, or surgery). 
            Your role is to interpret the new problem that occurred *after* this initial intervention. 
            You have access to the patient's basic information (age, sex), the primary complaint at first visit, the treatment received, 
            its medical purpose, the KL grade, and the detailed dialogue about the issue that followed. 
            Using this information, your job is to help explain the nature of the current complication or symptom flare, 
            propose likely clinical causes, and highlight any red flags that may need further intervention.
            
            Korean: 당신은 근골격계 질환을 전문으로 하는 숙련된 임상의입니다. 평가하고 있는 환자는 이미 
            초기 상담과 치료를 받았습니다(스테로이드 주사, 히알루론산 주사, NSAIDs 또는 수술 등). 
            당신의 역할은 이러한 초기 중재 *이후*에 발생한 새로운 문제를 해석하는 것입니다. 
            환자의 기본 정보(나이, 성별), 첫 방문 시 주요 증상, 받은 치료, 그 의학적 목적, KL 등급, 
            그리고 이후 발생한 문제에 대한 상세한 대화 내용에 접근할 수 있습니다. 
            이 정보를 사용하여 현재 합병증이나 증상 악화의 성격을 설명하고, 가능한 임상적 원인을 제안하며, 
            추가 중재가 필요할 수 있는 위험 신호를 강조하는 것이 당신의 업무입니다.
            """,
            verbose=True,
            llm = llm,
            # knowledge_sources=[diagnosis_knowledge]
        )
        
    def agent_alert(self) -> Agent:
        return Agent(
            role="Emergency Risk Assessor / 응급 위험도 평가 전문가",
            goal="""
            English: Thoroughly analyze the patient's condition using all available data to classify the situation as 
            Green, Yellow, or Red. Carefully evaluate the current medical state with clinical reasoning. 
            Green: no treatment required, observation is sufficient. 
            Yellow: not urgent but requires follow-up if symptoms worsen. 
            Red: immediate medical attention needed. 
            Your classification must be based on integrated clinical logic and conservative medical judgment.
            
            Korean: 사용 가능한 모든 데이터를 사용하여 환자의 상태를 철저히 분석하고 상황을 
            Green, Yellow 또는 Red로 분류합니다. 임상적 추론으로 현재 의학적 상태를 신중하게 평가합니다. 
            Green: 치료가 필요하지 않으며 관찰로 충분합니다. 
            Yellow: 긴급하지는 않지만 증상이 악화되면 추적 관찰이 필요합니다. 
            Red: 즉시 의료진의 진료가 필요합니다. 
            분류는 통합된 임상 논리와 보수적인 의학적 판단에 기반해야 합니다.
            """,
            backstory="""
            English: You are a clinical triage specialist responsible for identifying red-flag symptoms and assessing emergency risk levels. 
            The patient has already undergone an initial consultation and received treatment (e.g., injection, NSAIDs, surgery). 
            You have access to the patient's sex, age, KL grade, initial symptoms, treatment and its purpose, the complication or issue 
            that occurred after treatment, the detailed symptom description obtained through a medical dialogue, and the analysis result from the Diagnosis Agent. 
            Your task is to synthesize this information into a clinically sound risk assessment. 
            The stakes are high: a false Red may cause patient anxiety, while a missed Red may result in clinical deterioration. 
            Your classification must balance caution with clinical relevance, and should be explainable with medical rationale.
            
            Korean: 당신은 위험 징후 증상을 식별하고 응급 위험도를 평가하는 임상 트리아지 전문가입니다. 
            환자는 이미 초기 상담을 받고 치료를 받았습니다(주사, NSAIDs, 수술 등). 
            환자의 성별, 나이, KL 등급, 초기 증상, 치료 및 그 목적, 치료 후 발생한 합병증이나 문제, 
            의료 대화를 통해 얻은 상세한 증상 설명, 그리고 진단 에이전트의 분석 결과에 접근할 수 있습니다. 
            당신의 임무는 이 정보를 임상적으로 타당한 위험 평가로 종합하는 것입니다. 
            위험도가 높습니다: 잘못된 Red는 환자 불안을 야기할 수 있고, 놓친 Red는 임상적 악화를 초래할 수 있습니다. 
            분류는 주의와 임상적 관련성의 균형을 맞춰야 하며, 의학적 근거로 설명 가능해야 합니다.
            """,
            verbose=True,
            llm = llm,
            # knowledge_sources=[alert_knowledge]
        )
        
    def agent_doctor_summary(self) -> Agent:
        return Agent(
            role="Medical Summary Specialist / 의료진 요약 전문가",
            goal="""
            English: Provide concise, structured, and clinically relevant summaries tailored for physician review in EMR systems
            Korean: EMR 시스템에서 의사 검토를 위해 맞춤화된 간결하고 구조화된 임상적으로 관련성 높은 요약을 제공합니다
            """,
            backstory="""
            English: As an experienced clinical assistant familiar with EMR standards, you specialize in synthesizing patient-reported data, diagnostic insights, and clinical recommendations into structured, physician-friendly summaries. 
            Your reports enable swift decision-making and facilitate efficient follow-up actions. You emphasize clarity, brevity, medical accuracy, and actionable insights, ensuring summaries integrate seamlessly with hospital EMR workflows.
            
            Korean: EMR 표준에 익숙한 숙련된 임상 보조자로서, 환자 보고 데이터, 진단 통찰 및 임상 권장사항을 
            구조화된 의사 친화적 요약으로 종합하는 것을 전문으로 합니다. 
            당신의 보고서는 신속한 의사결정을 가능하게 하고 효율적인 후속 조치를 촉진합니다. 
            명확성, 간결성, 의학적 정확성 및 실행 가능한 통찰을 강조하여 요약이 병원 EMR 워크플로우와 원활하게 통합되도록 합니다.
            """,
            verbose=True,
            llm = llm
        )

    def agent_explain(self) -> Agent:
        return Agent(
            role=(
                "당신은 외래 진료실에서 진단 설명과 초기 질문 답변을 담당하는 숙련된 간호사입니다. "
                "의료진의 진단을 환자가 이해하기 쉽게 설명하고, 사전에 수집된 환자의 질문에 답변합니다."
            ),
            goal=(
                "다음 medical diagnosis를 기반으로 환자에게 쉽게 설명하고,"
                "CrewInput으로 주어지는 질문 목록에 대해 차근차근 답변하세요. "
                "설명과 답변이 끝난 뒤에는 '추가적인 질문이 있으신가요?'라고 물어보며 대화를 이어갈 준비를 하세요."
            ),
            backstory=(
                "당신은 수년간 정형외과 외래 간호사로서 진단 설명과 환자 응대 경험이 풍부합니다. "
                "환자가 불안해하지 않도록 공감적이고 따뜻한 말투를 사용하며, 어려운 용어는 쉽게 풀어줍니다."
            ),
            verbose=True,
            llm=llm,
            # knowledge_sources=[tell_knowledge]
        )

    def agent_qna(self) -> Agent:
        return Agent(
            role=(
                "당신은 환자가 추가로 묻는 질문이나 요구사항을 계속해서 응답하는 전문 간호사입니다. "
                "의료진의 진단을 참고하며, 이전 대화 내용도 함께 고려해 답변하세요."
            ),
            goal=(
                "환자가 명시적으로 대화를 종료하기 전까지, "
                "추가 질문이나 요청에 대해 계속해서 응답하고, "
            ),
            backstory=(
                "당신은 외래 간호사로서 환자의 재질문을 빠짐없이 파악하고 답변을 이어가는 숙련된 커뮤니케이터입니다. "
                "환자가 불안하거나 놓치는 부분이 없도록 공감적인 태도로 안내합니다."
            ),
            verbose=True,
            llm=llm,
            # knowledge_sources=[tell_knowledge]
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
            description="""
            English: Using the patient's age, sex, initial complaint and treatment, treatment goal, KL grade, 
            details of post-treatment issues, and the follow-up conversation with the patient, 
            analyze the situation from a clinical perspective. Generate a differential diagnosis ranked by likelihood, 
            explain the clinical scenario in detail, and infer likely medical causes. 
            Do not finalize a diagnosis; instead, present possible explanations and next-step recommendations. 
            The patient already received initial care and is now reporting new or worsening issues. 
            Your goal is to assess the cause of these post-treatment symptoms and inform the next best clinical action.
            
            Korean: 환자의 나이, 성별, 초기 증상 및 치료, 치료 목표, KL 등급, 
            치료 후 문제의 세부사항, 그리고 환자와의 후속 대화를 사용하여 
            임상적 관점에서 상황을 분석합니다. 가능성별로 순위를 매긴 감별진단을 생성하고, 
            임상 상황을 자세히 설명하며, 가능한 의학적 원인을 추론합니다. 
            진단을 확정하지 말고, 가능한 설명과 다음 단계 권장사항을 제시합니다. 
            환자는 이미 초기 치료를 받았으며 현재 새로운 또는 악화된 문제를 보고하고 있습니다. 
            목표는 이러한 치료 후 증상의 원인을 평가하고 다음 최적의 임상 조치를 알리는 것입니다.
            """,
            expected_output="""
            다음 필드를 포함하는 사전(dictionary):
            - differential_diagnosis: 가능성과 근거를 포함한 감별 진단 목록
            - clinical_summary: 현재 상태에 대한 전반적인 해석
            - red_flags: 중요한 경고 신호 목록
            - recommendations: 임상의를 위한 다음 단계 제안
            """,
            agent=self.agent_diagnosis(),
            context = [self.task_ask_and_query()]
        )
        
    def task_send_alert(self) -> Task:
        return Task(
            description="""
            English: Review the patient's demographic info (age, sex), initial symptoms, treatment and its intent, KL grade, 
            post-treatment symptom details, follow-up dialogue, and the diagnosis agent's output. 
            Using all of this information, classify the patient's current risk level into one of three categories:
            - Green: no immediate treatment needed, safe for observation.
            - Yellow: not urgent now, but requires monitoring or clinic visit if symptoms worsen.
            - Red: urgent, patient must seek medical care immediately.
            Base your classification on clinical reasoning and medical red flag thresholds. 
            Err on the side of caution, but avoid false alarms. Justify your decision with concise medical rationale.
            
            Korean: 환자의 인구통계학적 정보(나이, 성별), 초기 증상, 치료 및 그 의도, KL 등급, 
            치료 후 증상 세부사항, 후속 대화 및 진단 에이전트의 출력을 검토합니다. 
            이 모든 정보를 사용하여 환자의 현재 위험도를 다음 세 가지 범주 중 하나로 분류합니다:
            - Green: 즉시 치료가 필요하지 않으며 관찰로 안전합니다.
            - Yellow: 현재 긴급하지는 않지만 증상이 악화되면 모니터링이나 클리닉 방문이 필요합니다.
            - Red: 긴급하며, 환자는 즉시 의료진의 진료를 받아야 합니다.
            임상 추론과 의학적 위험 신호 임계값에 기반하여 분류합니다. 
            주의를 기울이되 허위 경보는 피합니다. 간결한 의학적 근거로 결정을 정당화합니다.
            """,
            expected_output="""
            다음 필드를 포함하는 사전(dictionary):
            - severity_level: ['green', 'yellow', 'red'] 중 하나
            - reasoning: 이 심각도 수준이 할당된 이유에 대한 임상적 설명
            - next_steps: 심각도에 따른 환자 또는 의사 대상 권장 사항
            """,
            agent=self.agent_alert(),
            context = [self.task_diagnose()]
        )
        
    def task_summarize_for_doctor(self) -> Task:
        return Task(
            description="""
            English: Generate a structured, EMR-ready summary for physician review based on comprehensive patient interaction data, including:
            - Patient demographics and relevant medical history
            - Chief complaints and detailed symptom characterization
            - Diagnostic agent's analysis and suggested diagnosis probabilities
            - Actionable recommendations including potential next steps and follow-up plans
            - Urgency indicators derived from Alert Agent analysis

            Korean: 포괄적인 환자 상호작용 데이터를 기반으로 의사 검토를 위한 구조화된 EMR 준비 요약을 생성합니다:
            - 환자 인구통계학적 정보 및 관련 의료 이력
            - 주요 증상 및 상세한 증상 특성화
            - 진단 에이전트의 분석 및 제안된 진단 확률
            - 잠재적 다음 단계 및 후속 계획을 포함한 실행 가능한 권장사항
            - 알림 에이전트 분석에서 도출된 긴급도 지표
            """,

            expected_output="""
            다음을 포함한 간결하고 구조화된 요약:
            1. 환자 요약:
            - 나이, 성별, 진단 이력, 관련 시술 (예: 이전 무릎 수술, 주사)
            
            2. 주요 증상:
            - 주요 증상 (예: 무릎 통증, 부종, 운동성 감소)
            - 증상 지속 기간, 강도, 시간 경과에 따른 변화
            
            3. 진단 통찰:
            - 주의 필요한 주요 임상 소견 및 증상 패턴 (예: 무릎 열감, 24시간 내 급속한 부종 진행, 보행 곤란)
            - 진단 에이전트가 식별한 중요한 증상 클러스터 및 시간적 연관성
            - 즉시 평가가 필요한 임상적 위험 신호 또는 우려되는 증상 조합
            
            4. 권장 임상 조치:
            - 필요한 즉시 조치 (있는 경우)
            - 제안된 후속 일정 (예: 내일 클리닉 방문)
            - 권장 환자 관리 및 치료 지침 (예: 통증 관리 프로토콜, 냉찜질 빈도)
            
            5. 알림 수준:
            - 명확하게 표시된 알림 상태 (Red, Yellow, Green) 및 긴급도 수준의 근거
            """,
            agent=self.agent_doctor_summary(),
            context = [self.task_diagnose(), self.task_send_alert()]
        )

    def task_explain(self) -> Task:
        return Task(
            name="진단 설명 및 초기 질문 답변",
            description=(
                "knowledge_source(medical_diagnosis)를 기반으로 환자가 이해할 수 있도록 진단을 설명하고, "
                "CrewInput으로 제공되는 질문 목록에 대해 답변하세요. "
                "알림 상태를 기반으로 환자의 다음 행동을 하세요."
                "1. Red : 의료진이 환자에게 직접 연락을 취할 예정이니 안내해주세요"
                "2. Yellow : 의료기관 방문이 필요한 상황이므로 {schedule_info}를 고려하여 환자와 예약을 잡아주세요. 예약 가능한 날짜가 없을 경우 의료진이 따로 연락을 취할 예정이라 안내해주세요."
                "3. Green : 추가 행동 없음"
                "마지막에는 '추가적인 질문이 있으신가요?'라는 문구로 후속 질문을 유도합니다. "
                "추가 질문이 들어올 때를 대비해 따뜻하고 공감적인 간호사 어투를 유지하세요."
            ),
            expected_output=(
                "진단 설명 + query 답변 + 마지막에 '추가적인 질문이 있으신가요?' 로 끝나는 한 차례 메시지."
            ),
            output_json=None,
            agent=self.agent_explain(),
            human_input=False,
            context = [self.task_diagnose(), self.task_send_alert()]
        )
    
    def task_qna(self) -> Task:
        return Task(
            name="추가 질문 응답",
            description=(
                "환자가 추가로 묻거나 요청하는 내용을 knowledge_source(medical diagnosis)와 "
                "이전 대화 내용을 기반으로 계속해서 대답하세요. "
                "환자가 '대화를 종료합니다' 등 종료의사를 명시하기 전까지 계속 질의응답을 이어갑니다. "
                "공감적이고 따뜻한 간호사 어투를 사용하며, 필요 시 질문을 다시 확인해도 됩니다."
            ),
            expected_output=(
                "추가 질문이나 요청이 들어올 때마다 적절히 답변하며, 환자가 끝내겠다고 할 때까지 이어가는 다중턴 대화."
            ),
            output_json=None,
            agent=self.agent_qna(),
            human_input=True,
            context = [self.task_diagnose()]
        )

    def crew(self) -> Crew:
        return Crew(
            agents=[
                self.agent_ask(),
                self.agent_diagnosis(),
                self.agent_alert(),
                self.agent_doctor_summary(),
                self.agent_explain(),
                self.agent_qna()
            ],
            tasks=[
                self.task_ask_and_query(),
                self.task_diagnose(),
                self.task_send_alert(),
                self.task_summarize_for_doctor(),
                self.task_explain(),
                self.task_qna()
            ],
            process=Process.sequential,
            verbose=False,
            memory=False
        )

if __name__ == "__main__":
    initial = input("\n[System] Please start by introducing symptom:\n> ")
    TEXT = ("62세 여성, 3개월 전 양측 무릎 관절염(KL 2~3단계) 진단, 좌측 더 심함, HKA: 우측 varus 4도, 좌측 7도"
            "6개월 지속형 연골주사 치료 중 (좌우 모두), 어제 주사 맞음")
            
    input_data = CrewInput(initial_message=initial,background_info=TEXT, schedule_info=TEXT)

    try:
        Piethon2().crew().kickoff(inputs=input_data.model_dump())
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")
