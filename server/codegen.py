import random
import json
import os

# 랜덤 코드 생성 함수
def generate_random_code(existing_codes):
    while True:
        # 4개의 숫자 그룹을 합쳐서 코드 생성
        code = '-'.join([''.join([random.choice('0123456789') for _ in range(4)]) for _ in range(4)])
        
        # 생성된 코드가 이미 존재하는 코드 목록에 없다면 반환
        if code not in existing_codes:
            return code

# 현재 디렉토리 경로 가져오기
current_directory = os.path.dirname(os.path.realpath(__file__))

# 기존 데이터 파일 경로
database_path = os.path.join(current_directory, 'database.json')

# 기존 코드 목록 가져오기 (중복 검증용)
existing_codes = set()
if os.path.exists(database_path):
    with open(database_path, 'r', encoding='utf-8') as f:
        existing_data = json.load(f)
        existing_codes = {entry['code'] for entry in existing_data}

# 데이터 생성
data = []
for _ in range(200):
    code = generate_random_code(existing_codes)
    entry = {
        "code": code,
        "name": "",
        "phone": "",
        "isempty": 1
    }
    data.append(entry)
    existing_codes.add(code)  # 생성된 코드 목록에 추가

# 파일 저장
with open(database_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"database.json 파일이 성공적으로 생성되었습니다. 경로: {database_path}")
