package fittoring.mentoring.presentation.api.admin;

import fittoring.config.auth.Login;
import fittoring.config.auth.LoginInfo;
import fittoring.mentoring.business.service.MentoringService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class AdminMentoringController {

    private final MentoringService mentoringService;

    @GetMapping("/admin/mentorings/{mentoringId}")
    public ResponseEntity<Void> deleteMentoring(@Login LoginInfo loginInfo,
                                                @PathVariable("mentoringId") Long mentoringId) {
        mentoringService.deleteMentoringByAdmin(loginInfo, mentoringId);
        return ResponseEntity.noContent().build();
    }
}
