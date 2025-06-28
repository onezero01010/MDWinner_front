import asyncio

from dotenv import load_dotenv
from pydantic import BaseModel, ConfigDict, Field
from crewai import Agent, Task, Crew, LLM
from crewai.tools import BaseTool

OPEN_AI_KEY="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"

llm = LLM(
    model="openai/gpt-4o-mini",
    api_key=OPEN_AI_KEY,
    temperature=0.5,
)

load_dotenv(override=True)

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

# information_collector = Agent(
#     role="Symptom information collector",
#     goal=(
#         "You communicate with the patient to collect detailed symptom information in a natural and structured way. "
#         "You should obtain the following details: "
#         "Onset (when did the symptom start), "
#         "Location (where is the symptom), "
#         "Duration (how long it lasts), "
#         "Course (progression of the symptom), "
#         "Character (detailed nature of the symptom, e.g., pain type, swelling, redness, tenderness, etc.), "
#         "Associated symptoms (systemic symptoms like fever, chills, fatigue, muscle pain), "
#         "Factors (relieving or aggravating factors). "
#         "If some items are missing, ask the patient follow-up questions in a friendly and professional tone."
#         "initial message: {initial_message}"
#     ),
#     tools=[human_tool],
#     verbose=True,
#     backstory=(
#         "You are a professional nurse with a strong background in medical interviewing. "
#         "You excel at obtaining comprehensive symptom data while putting patients at ease. "
#         "You ask about OLDCOEXCAFE dimensions in detail and verify nothing is missing."
#     ),
#     llm=llm
# )


information_collector = Agent(
    role=(
        "당신은 임상 병력 청취에 특화된 숙련된 간호사입니다. "
        "역할은 환자의 초기 증상({initial_message})과 배경 정보({background_info})를 바탕으로, "
        "의료진이 감별진단명(impression)과 중증도(alertness: severe, moderate, benign)를 "
        "추정할 수 있도록 충분한 임상정보를 구조적이고 체계적으로 수집하는 것입니다."
    ),
    goal=(
        "당신의 목표는 감별진단과 alertness 판단에 필요한 모든 임상정보를 누락 없이 확보하는 것입니다. "
        "이를 위해 필요한 질문을 스스로 설계하며, 환자가 답하기 쉽도록 구체적이고 이해하기 쉬운 질문을 사용하세요. "
        "이미 언급된 정보에 대해서는 중복 질문을 피하고, "
        "정보가 충분히 모였다고 판단되면 질문을 멈추고, "
        "수집한 임상정보를 JSON 형태로 정리하여 출력하세요."
    ),
    backstory=(
        "당신은 다년간 정형외과 외래에서 병력청취를 전문적으로 수행해온 간호사로서, "
        "환자가 솔직하고 편안하게 말할 수 있도록 공감적이고 따뜻한 태도를 유지하며, "
        "필요한 핵심 정보를 놓치지 않고 빠짐없이 확보하는 임상적 직관을 가지고 있습니다."
    ),
    tools=[human_tool],
    verbose=True,
    llm=llm
)




# collector_task = Task(
#     name="Collect Symptom Information",
#     description=(
#         "Based on the chat log, collect all symptom details "
#         "using the OLDCOEXCAFE framework: "
#         "Onset, Location, Duration, Course, Character, Associated symptoms, and Factors. "
#         "Ask follow-up questions naturally, and keep the conversation professional and empathetic. "
#         "Output should include all fields in a structured format without missing values."
#     ),
#     expected_output=(
#         "A JSON object with keys: onset, location, duration, course, character, associated_symptom, factor. "
#         "Output must be valid JSON with no markdown code fences or explanations."
#     ),
#     output_json=SymptomInformationOutput,
#     agent=information_collector,
#     human_input=False
# )


collector_task = Task(
    name="임상정보 수집",
    description=(
        "환자의 초기 증상({initial_message})과 배경 정보({background_info})를 참고하여, "
        "의료진이 감별진단(impression)과 alertness(중증도)를 추정할 수 있을 만큼 "
        "충분하고 체계적인 임상정보를 다중턴 대화를 통해 수집하세요. "
        "질문은 환자가 이해하기 쉽게 표현하고, 이미 언급된 내용을 반복하지 않으며, "
        "누락된 항목이나 불분명한 부분은 자연스럽고 공감적인 간호사 어투로 보완 질문을 하세요. "
        "임상정보가 충분하다고 판단되면 질문을 종료하고, "
        "마지막으로 수집한 임상정보를 JSON 형태로 정리해 출력하세요. "
        "JSON에는 impression이나 alertness를 포함하지 말고, "
        "환자가 제공한 객관적 임상정보만 포함하세요."
    ),
    expected_output=(
        "수집된 임상정보를 JSON 객체로 출력하며, "
        "마크다운 코드블록이나 부가 설명은 포함하지 말고 JSON 객체만 최종적으로 제시하세요."
    ),
    output_json=SymptomInformationOutput,
    agent=information_collector,
    human_input=False
)




my_crew = Crew(
    agents=[information_collector],
    tasks=[collector_task],
    verbose=False,
    memory=False
)

initial = input("\n[System] Please start by introducing symptom:\n> ")
TEXT="""62세 여성, 3개월 전 양측 무릎 관절염(KL grade 우측 2, 좌측 4) 진단, 좌측 더 심함, HKA: 우측 varus 4도, 좌측 7도
어제 좌측 무릎에 스테로이드 주사 맞음
"""
input_data = CrewInput(initial_message=initial,background_info=TEXT)

result = my_crew.kickoff(inputs=input_data.model_dump())

print("\n\n✅ [Final Result]")
print(result)




