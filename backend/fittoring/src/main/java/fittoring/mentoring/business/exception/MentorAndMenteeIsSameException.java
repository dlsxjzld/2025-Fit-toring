package fittoring.mentoring.business.exception;

public class MentorAndMenteeIsSameException extends RuntimeException {

    public MentorAndMenteeIsSameException(String message) {
        super(message);
    }
}
