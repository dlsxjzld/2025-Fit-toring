# 백엔드 컨벤션 및 협업 규칙

## Import문 설정

- **순서 설정**  
  IntelliJ > Code Style > Java > Import Layout  
  `Layout static imports separately` 옵션을 적용하고, 다음 순서로 설정한다:

- **Wildcard 설정**  
  IntelliJ > Code Style > Java > `Class count to use ...`, `Names count to use ...` 값을 `99`로 설정한다.

## 코드 스타일 파일

- IntelliJ > Code Style > Java > Schema에서 **WootecoStyle**을 선택해 전체 코드 스타일을 일괄 적용한다.

## 패키지 구조

- **도메인 기반 패키지 구조**를 사용한다.

- **이유**  
  계층형 구조는 클래스가 한 디렉토리에 몰리면서 가독성이 떨어진다.  
  도메인 단위 구조는 기능 중심으로 구조화되어 파악이 쉽다.


# Java 코드 컨벤션
- 기본적으로 [Google Java Style Guide](https://google.github.io/styleguide/javaguide.html)규칙을 따른다.

## 주석 작성

- `.java` 파일에는 `TODO` 주석만 사용한다.
- TODO는 이슈나 PR에 문서화가 불가능한 경우에만 작성한다.

## final 키워드 사용

- 모든 사용 가능한 인스턴스 필드에 `final` 키워드를 붙인다. (엔티티는 예외로 한다)
- 인스턴스 필드를 제외한 지역변수, 매개변수는 final 키워드를 필요할시 붙인다.

## 코드 포맷팅 (wootecoStyle)

- 클래스 선언 후 첫 줄에 개행한다.
- 클래스 마지막 줄에도 개행한다.
- 메서드 체이닝 시 줄바꿈을 사용해 정렬한다.

    ```java
    return reservations.stream()
            .map(ReservationRegisterResponse::of)
            .toList();
    ```
  
## DTO 네이밍

- 컨트롤러 요청/응답 DTO는 `~Request`, `~Response`로 명명한다.
- 그 외의 DTO는 `~Dto`로 명명한다.

## 클래스 및 네이밍 전략

- 클래스와 메서드는 카멜 케이스로 작성한다.
- 상수는 대문자와 언더스코어를 사용한다.
- 패키지는 모두 소문자로 작성한다.
- 조회 메서드 네이밍
    - get : 값을 찾지 못했을 때 반환 값이 없고 예외가 발생함. (필드 getter는 예외)
    - find : 값을 찾지 못했을 때에도 null 또는 빈 리스트 등의 반환값이 항상 존재하는 경우

## 메서드 배치 순서

- public 메서드 다음에 해당 메서드에서 사용하는 private 메서드를 배치한다.

    ```java
    public 메서드()
        private 메서드()

    public 메서드()
    ```

## 메서드 길이 제한

- 메서드는 20줄을 초과하지 않도록 작성한다.
- 공백은 제외한다.
- 개행을 위한 라인 수 는 제외한다.

## 어노테이션 정렬

- 어노테이션은 중요한 순으로 클래스와 가깝게 배치한다.
- 뒤섞지 않으며, 일관성을 유지한다.

## Repository 어노테이션

- `@Repository` 어노테이션을 붙인다.

## Enum 형식

- Enum은 다음과 같은 형식을 따른다.

    ```java
    enum A {

        B(),
        C(),
        ;

        ...
    }
    ```

## 메서드 시그니처 개행 기준

- 매개변수가 3개 이상일 경우 개행한다.

## 인터페이스 메서드 개행

- 인터페이스 내 메서드 선언 간에는 한 줄을 개행한다.

    ```java
    Member findById(Long id);

    Member findByName(String name);
    ```

## 빈 생성자 형식

- 빈 생성자는 한 줄로 작성한다.

    ```java
    public Fit() {}
    ```

## 테스트 코드 컨벤션

- 테스트 클래스에는 `@DisplayName`을 사용한다.
- 테스트 메서드명은 실제 테스트 대상 메서드명과 동일하게 작성한다.
- 어투는 `~다.` 형태로 작성한다.

    ```java
    @DisplayName("~이라면 예외가 발생한다.")
    @DisplayName("~이라면 예외가 발생하지 않는다.")
    ```

- 테스트는 `given - when - then` 형식을 따른다.

    ```java
    @DisplayName("...")
    @Test
    void 메서드명() {
        // given

        // when

        // then
    }
    ```

## 테스트 mock / DB 사용

- 테스트 코드에서 `data.sql`은 사용하지 않는다. 필요한 경우 팀과 논의 후 사용 여부를 결정한다.
- 테스트 코드에서는 `Assertions.*`에 한해 `static import`를 허용한다.
- 프로덕션 코드에서는 `static import`를 사용하지 않는다.

## 환경변수

- 환경변수는 Git에 업로드 되어서는 안 된다.
