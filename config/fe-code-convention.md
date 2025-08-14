## export 방식

- export 방식 - 컴포넌트 단축키 사용
- 컴포넌트, 훅의 경우 export default는 밑에 작성
- 함수의 경우 export

## CSS

- css 크기 단위
    - rem
    - body 62.5% → 10px 당 1rem
- css props 접미사

| 명칭 | 용도 설명 | 예시 |
| --- | --- | --- |
| **Layout** | Page 단위의 전체 레이아웃 구성 (ex. 모바일 레이아웃) | `<MobileLayout>`, `<MainLayout>` |
| **Container** | 여러 개의 요소를 묶는 용도. 일반적으로 컴포넌트의 최상위 요소로 사용됨 | `<ProfileContainer>`, `<PostContainer>` |
| **Wrapper** | 하나의 요소를 감싸는 용도. 컴포넌트 내부에 여러 개 존재 가능 | `<ImageWrapper>`, `<TextWrapper>` |
| **List** | `<ul>` 태그를 사용할 때 권장되는 이름 | `<CommentList>`, `<MenuList>` |
| **Item** | `<li>` 태그 또는 반복되는 요소에 사용되는 이름 | `<CommentItem>`, `<MenuItem>` |

- 컴포넌트와 스타일을 코드를 같은 파일에 위치시키고 접두사 Styled 사용
- 도메인 이름 붙이지 않기

```tsx
// bad
function ShoppingCart(props) {
  return (
    <ShoppingCartWrapper> 
    </ShoppingCartWrapper>
  );
}

// good
function ShoppingCart(props) {
  return (
    <Wrapper>
    </Wrapper>
  );
}
```

- CSS 속성 선언 순서 → Naver Site

| 순서 | 의미 | 대표되는 속성 |
| --- | --- | --- |
| 1 | 레이아웃 | display, visibility, overflow, float, clear, position, top, right, bottom, left, z-index |
| 2 | BOX | width, height, margin, padding, border |
| 3 | 배경 | background |
| 4 | 폰트 | font, color, letter-spacing, text-align, text-decoration, text-indent, vertical-align, white-space |
| 5 | 기타 | 위에 언급되지 않은 나머지 속성들로 폰트 관련 속성 이후에 선언하며, 기타 속성 내의 선언 순서는 무관함 |

## 변수

변수명 (축약, Container, Wrapper, Box)

- boolean값
    - 수동태(접미사 ed)로 하기!
        - validated, disabled, checked
- 특정명(Image → Img, wrapper → wrap) 제외하고 다 축약 금지
- 카멜케이스
- 복수형은 명사 + s

## 상수

- 상수: `UPPER_SNAKE_CASE` + `as const`
    - 매직 넘버 지양
    - 클라이언트 url 경로에도 적용

상수 네이밍 예시:

```tsx
const CONSTANTS = {
  SOMETHING: "상수를 입력해주세요!"
} as const
```

## 조건문

```tsx
if (조건) {
  return ...
}
```

- 한 줄이어도 중괄호 사용
- 삼항 연산자 중첩 금지
- 기본적으로 early return 지향

## 타입

- `PascalCase`로 작성
- interface vs type
    - interface
        - 확장해야 할 때
        - 객체
    - type
        - 단순한 원시값, 튜플, 유니언 타입 선언
- children 무조건 PropsWithChildren
    - jsx만 와야 할 때 React.ReactElement
- 컴포넌트 접미사: props
- 훅 접미사: params
- 타입 단언 지양
- any 사용 금지
- `import type`으로 가져오기
    - [consistent-type-imports](https://typescript-eslint.io/rules/consistent-type-imports/)
- 객체에는 as const

## 함수

- 카멜케이스
- 컴포넌트만 function 선언문, 나머지는 화살표 함수
- 함수 네이밍
    - boolean 리턴시 `is + 명사/동사+ed`
    - 예: isArray, isValid, isSelected
- 이벤트 객체 인라인 함수 금지
    - 한 줄이어도 분리

```tsx
// bad
<Component onClick={(e) => {}} />

// good
<Component onClick={handleClickMap} />
```

- 매개변수 3개 이상이면 객체로
- 이벤트 핸들러 네이밍
    - on-: 이벤트 발생
    - handle-: 이벤트 처리
    - prefix 없음: 동작 수행

```tsx
function Quantity({ closeModal, updateNumber }) {
  const handleButtonClick = () => {
    closeModal()
    updateNumber()
  }

  return <UpdateQuantity onClick={handleButtonClick} />
}

function UpdateQuantity({ onClick }) {
  return (<button onClick={onClick} />)
}
```

## 훅

- 원시 타입은 추론 사용

```tsx
const [count, setCount] = useState(0);
```

- 객체 타입은 직접 정의

```tsx
const [info, setInfo] = useState<Info>({
  name: 'daisy',
  age: '26',
});
```

## 디렉토리 구조

- 컴포넌트: PascalCase
- 나머지 파일: camelCase
- 폴더명 여러 개면 s 붙이기
- 목적조직: Co-location

```markdown
📁 src
├── 📁 pages                            # pages
│   ├── 📁 home                       # 홈 페이지
│   │   ├── 📁 hooks                  # 커스텀 훅
│   │   ├── 📁 apis                   # API 함수
│   │   ├── 📁 components             # 컴포넌트 (대문자 시작)
│   │   │   └── 📁 CartItem
│   │   └── 📁 utils                  # 유틸 함수
│
│   ├── 📁 booking # 상품 도메인
│   │   ├── 📁 hooks
│   │   ├── 📁 apis
│   │   ├── 📁 components
│   │   └── 📁 utils
|   │   └── 📄 BookingPage.tsx
│
│   └── 📁 common                       # 각 도메인 내부 전용 공통 모듈
│       ├── 📁 hooks
│       ├── 📁 apis
│       ├── 📁 components
│       └── 📁 utils
│
├── 📁 common                           # 전역 공통 모듈 (어디서나 사용 가능)
│   ├── 📁 hooks
│   ├── 📁 apis
│   │   └── 📄 apiClient.ts             # 공통 API 클라이언트
│   ├── 📁 components
│   └── 📁 utils
│
├── 📄 main.tsx                         # 진입점
└── ...

```

- li 태그면 list (cardList)
- 아니면 s 붙이기 (buttons)

---
