package fittoring.mentoring.business.service;

import fittoring.mentoring.business.exception.BusinessErrorMessage;
import fittoring.mentoring.business.exception.CategoryNotFoundException;
import fittoring.mentoring.business.exception.MentorNotSameException;
import fittoring.mentoring.business.exception.MentoringAlreadyExistException;
import fittoring.mentoring.business.exception.MentoringNotFoundException;
import fittoring.mentoring.business.exception.NotFoundMemberException;
import fittoring.mentoring.business.model.Category;
import fittoring.mentoring.business.model.CategoryMentoring;
import fittoring.mentoring.business.model.Certificate;
import fittoring.mentoring.business.model.Image;
import fittoring.mentoring.business.model.ImageType;
import fittoring.mentoring.business.model.Member;
import fittoring.mentoring.business.model.Mentoring;
import fittoring.mentoring.business.repository.CategoryMentoringRepository;
import fittoring.mentoring.business.repository.CategoryRepository;
import fittoring.mentoring.business.repository.MemberRepository;
import fittoring.mentoring.business.repository.MentoringRepository;
import fittoring.mentoring.business.service.dto.ModifyMentoringDto;
import fittoring.mentoring.business.service.dto.RegisterMentoringDto;
import fittoring.mentoring.presentation.dto.MentoringResponse;
import fittoring.mentoring.presentation.dto.MentoringSummaryResponse;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
@Service
public class MentoringService {

    private final ImageService imageService;
    private final CertificateService certificateService;

    private final MentoringRepository mentoringRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryMentoringRepository categoryMentoringRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public MentoringResponse registerMentoring(RegisterMentoringDto dto) {
        Member member = memberRepository.findById(dto.mentorId())
            .orElseThrow(() -> new NotFoundMemberException(BusinessErrorMessage.MEMBER_NOT_FOUND.getMessage()));
        validateAlreadyRegistered(member);
        final Mentoring mentoring = new Mentoring(
            member,
            dto.price(),
            dto.career(),
            dto.content(),
            dto.introduction()
        );
        final Mentoring savedMentoring = mentoringRepository.save(mentoring);

        List<String> categoryTitles = dto.category();
        mapCategoriesToMentoring(categoryTitles, savedMentoring);

        Image profileImage = saveProfileImage(dto.profileImage(), savedMentoring);

        certificateService.mapCertificatesToMentoring(dto.certificateInfos(), dto.certificateImages(), savedMentoring);
        member.registerAsMentor();
        return MentoringResponse.from(savedMentoring, categoryTitles, profileImage);
    }

    private void validateAlreadyRegistered(Member member) {
        if (mentoringRepository.existsByMentor(member)){
            throw new MentoringAlreadyExistException(BusinessErrorMessage.MENTORING_ALREADY_EXIST.getMessage());
        }
    }

    private void mapCategoriesToMentoring(List<String> categoryTitles, Mentoring savedMentoring) {
        for (String categoryTitle : categoryTitles) {
            Category category = categoryRepository.findByTitle(categoryTitle)
                .orElseThrow(
                    () -> new CategoryNotFoundException(BusinessErrorMessage.CATEGORY_NOT_FOUND.getMessage())
                );
            CategoryMentoring categoryMentoring = new CategoryMentoring(category, savedMentoring);
            categoryMentoringRepository.save(categoryMentoring);
        }
    }

    private Image saveProfileImage(MultipartFile profileImageFile, Mentoring mentoring) {
        if (profileImageFile == null) {
            return null;
        }
        return imageService.uploadImageToS3(profileImageFile, "profile-image", ImageType.MENTORING_PROFILE,
            mentoring.getId());
    }

    public List<MentoringSummaryResponse> findMentoringSummaries(
            String categoryTitle1,
            String categoryTitle2,
            String categoryTitle3
    ) {
        List<MentoringSummaryResponse> mentoringSummaryResponse;
        List<MentoringResponse> mentoringResponses = findMentorings(categoryTitle1, categoryTitle2, categoryTitle3);

        mentoringSummaryResponse = mentoringResponses.stream()
                .map(MentoringSummaryResponse::from)
                .collect(Collectors.toList());

        return mentoringSummaryResponse;
    }

    private List<MentoringResponse> findMentorings(
            String categoryTitle1,
            String categoryTitle2,
            String categoryTitle3
    ) {
        if (isNoCategoryFilter(categoryTitle1, categoryTitle2, categoryTitle3)) {
            List<Mentoring> allMentoring = mentoringRepository.findAll();
            return getMentoringResponses(allMentoring);
        }
        validateAllCategoryTitle(categoryTitle1, categoryTitle2, categoryTitle3);

        List<Mentoring> filteredMentorings = mentoringRepository.findAllMentoringWithFilter(
                categoryTitle1,
                categoryTitle2,
                categoryTitle3
        );

        return getMentoringResponses(filteredMentorings);
    }

    private boolean isNoCategoryFilter(String categoryTitle1, String categoryTitle2, String categoryTitle3) {
        return categoryTitle1 == null
               && categoryTitle2 == null
               && categoryTitle3 == null;
    }

    private List<MentoringResponse> getMentoringResponses(List<Mentoring> mentorings) {
        List<MentoringResponse> mentoringResponses = new ArrayList<>();
        for (Mentoring mentoring : mentorings) {
            List<String> categoryTitles = getCategoryTitlesByMentoringId(mentoring.getId());
            imageService.findByImageTypeAndRelationId(ImageType.MENTORING_PROFILE, mentoring.getId())
                    .ifPresentOrElse(
                            image -> mentoringResponses.add(
                                    MentoringResponse.from(mentoring, categoryTitles, image)),
                            () -> mentoringResponses.add(MentoringResponse.from(mentoring, categoryTitles))
                    );
        }
        return mentoringResponses;
    }

    private void validateAllCategoryTitle(String categoryTitle1, String categoryTitle2, String categoryTitle3) {
        validateExistCategoryTitle(categoryTitle1);
        validateExistCategoryTitle(categoryTitle2);
        validateExistCategoryTitle(categoryTitle3);
    }

    private void validateExistCategoryTitle(String categoryTitle) {
        if (categoryTitle != null && !categoryRepository.existsByTitle(categoryTitle)) {
            throw new CategoryNotFoundException(BusinessErrorMessage.CATEGORY_NOT_FOUND.getMessage());
        }
    }

    private List<String> getCategoryTitlesByMentoringId(Long mentoringId) {
        List<CategoryMentoring> categoryMappingsByMentoring = categoryMentoringRepository.findAllByMentoringId(
                mentoringId);
        return getCategoryTitlesByMentoring(categoryMappingsByMentoring);
    }

    private List<String> getCategoryTitlesByMentoring(List<CategoryMentoring> categoryMappingsByMentoring) {
        return categoryMappingsByMentoring.stream()
                .map(CategoryMentoring::getCategoryTitle)
                .collect(Collectors.toList());
    }

    public MentoringResponse getMentoring(final Long id) {
        Mentoring mentoring = mentoringRepository.findById(id)
                .orElseThrow(
                        () -> new MentoringNotFoundException(BusinessErrorMessage.MENTORING_NOT_FOUND.getMessage()));

        List<String> categoryTitles = getCategoryTitlesByMentoringId(mentoring.getId());
        Image image = imageService.findByImageTypeAndRelationId(ImageType.MENTORING_PROFILE, mentoring.getId())
                .orElse(null);
        if (image == null) {
            return MentoringResponse.from(mentoring, categoryTitles);
        }
        return MentoringResponse.from(mentoring, categoryTitles, image);
    }

    @Transactional
    public MentoringResponse modifyMentoring(ModifyMentoringDto dto) {
        Mentoring mentoring = findMentoringOwnedByMentor(dto.mentoringId(), dto.mentorId());
        deleteExistingMappings(dto.mentoringId());

        List<String> categoryTitles = dto.category();
        mapCategoriesToMentoring(categoryTitles, mentoring);
        Image profileImage = saveProfileImage(dto.profileImage(), mentoring);
        certificateService.mapCertificatesToMentoring(dto.certificateInfos(), dto.certificateImages(), mentoring);
        mentoring.modify(dto.price(), dto.career(), dto.content(), dto.introduction());

        return MentoringResponse.from(mentoring, categoryTitles, profileImage);
    }

    private Mentoring findMentoringOwnedByMentor(Long mentoringId, Long mentorId) {
        Mentoring mentoring = mentoringRepository.findById(mentoringId)
            .orElseThrow(() -> new MentoringNotFoundException(BusinessErrorMessage.MENTORING_NOT_FOUND.getMessage()));
        validateMentorMatches(mentoring, mentorId);
        return mentoring;
    }

    private void validateMentorMatches(Mentoring mentoring, Long mentorId) {
        if (mentoring.isSameMentorId(mentorId)) {
            return;
        }
        throw new MentorNotSameException(BusinessErrorMessage.MENTOR_NOT_SAME.getMessage());
    }

    private void deleteExistingMappings(Long mentoringId) {
        categoryMentoringRepository.deleteByMentoringId(mentoringId);
        List<Certificate> certificates = certificateService.findAllByMentoringId(mentoringId);
        certificateService.deleteAll(certificates);
        imageService.deleteMentoringProfileByMentoringId(mentoringId);
        for (Certificate certificate : certificates) {
            imageService.deleteCertificateByCertificateId(certificate.getId());
        }
    }
}
