import React, { createContext, useState, useContext, useEffect } from "react";

const translations = {
  en: {
    common: {
      error: "An error occurred",
      loading: "Loading...",
      submit: "Submit",
      cancel: "Cancel",
      select: "Select",
    },
    auth: {
      login: {
        title: "Login to Your Account",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        loginButton: "Log In",
        signupPrompt: "Don't have an account?",
        signupLink: "Sign Up",
        email: "Email",
        languageToggle: "عربي",
        loginSuccess: "Login successful",
        loginError: "Invalid email or password",
        password: "Password",
      },
      signup: {
        title: "Create Your Account",
        nameLabel: "Full Name",
        emailLabel: "Email Address",
        passwordLabel: "Password",
        confirmPasswordLabel: "Confirm Password",
        signupButton: "Sign Up",
        loginPrompt: "Already have an account?",
        loginLink: "Log In",
        languageToggle: "English",
        signupSuccess: "Account created successfully",
        passwordMismatch: "Passwords do not match",
      },
      logout: {
        title: "Logout",
      },
    },
    resources: {
      upload: {
        title: "Upload a Resource",
        description: "Share your knowledge with the community",
        uploadError: "Failed to upload resource. Please try again.",
        form: {
          title: "Resource Title",
          titlePlaceholder: "Enter a descriptive title",
          type: "Resource Type",
          category: "Category",
          file: "Upload File",
          fileHelp: "Supported formats: PDF, DOCX, PPTX, MP4",
          description: "Description",
          descriptionPlaceholder: "Provide a brief overview of the resource",
          tags: "Tags",
          tagsPlaceholder:
            "Add relevant tags to help others find your resource",
        },
        validation: {
          titleRequired: "Title is required",
          typeRequired: "Resource type is required",
          categoryRequired: "Category is required",
          fileRequired: "File is required",
          fileSizeLimit: "File size must be less than 50MB",
          fileTypeInvalid: "Invalid file type",
        },
        success: "Resource uploaded successfully!",
        error: "Failed to upload resource. Please try again.",
      },
      search: {
        placeholder: "Search resources...",
        filters: {
          type: "Resource Type",
          category: "Category",
          sortBy: "Sort By",
          sortOptions: {
            newest: "Newest",
            mostDownloaded: "Most Downloaded",
            highestRated: "Highest Rated",
          },
        },
      },
      details: {
        downloadButton: "Download Resource",
        downloadError: "Failed to download the resource",
        deleteSuccess: "Resource deleted successfully",
        deleteError: "Failed to delete the resource",
        writeReview: "Write a Review",
        uploadResource: "Upload Resource",
        rating: "Rating",
        comment: "Comment",
        submitReview: "Submit Review",
        reviews: "Reviews",
        noReviews: "No reviews yet.",
        deleteConfirmation: {
          title: "Delete Resource",
          message:
            "Are you sure you want to delete this resource? This action cannot be undone.",
          cancelButton: "Cancel",
          deleteButton: "Delete",
        },
      },
    },
    subjects: {
      image_processing: "Image Processing",
      medical_equipment: "Medical Equipment",
      biostatistics: " Biostatistics",
      digital_control: "Digital Control",
      medical_planning: "Medical Planning",
    },
    topics: {
      calculus: "Calculus",
      algebra: "Algebra",
      mechanics: "Mechanics",
      organicChemistry: "Organic Chemistry",
      programming: "Programming",
    },
    leaderboard: {
      title: "Leaderboard",
      noContributors: "No contributors found",
      level: "Level",
      points: "Points",
      sortBy: {
        points: "Sort by Points",
        level: "Sort by Level",
      },
      filters: {
        all: "All",
        weekly: "Weekly",
        monthly: "Monthly",
      },
      badges: {
        "Rookie Uploader": "Rookie Uploader",
        "Resource Master": "Resource Master",
        "Knowledge Sharer": "Knowledge Sharer",
        "Helpful Reviewer": "Helpful Reviewer",
      },
      badgeDescriptions: {
        "Rookie Uploader":
          "First steps in knowledge sharing! Uploaded first resource.",
        "Resource Master": "Consistent high-quality resource contributions.",
        "Knowledge Sharer":
          "Active sharing of valuable knowledge with the community.",
        "Helpful Reviewer": "Providing insightful and constructive reviews.",
      },
      columns: {
        rank: "Rank",
        user: "User",
        contributions: "Contributions",
        badges: "Badges",
        progress: "Progress",
        level: "Level",
        points: "Points",
      },
      stats: {
        totalContributors: "Total Contributors",
        topContributor: "Top Contributor",
        averagePoints: "Average Points",
      },
      tooltips: {
        levelTooltip: "Level {{level}}",
        pointsBreakdown: "Total Contribution Points: {{points}}",
        badgeProgress: "Badge Progress",
        badgeProgressTooltip: "Click to see badge progress details",
      },
    },
    dashboard: {
      uploadedResources: "Uploaded Resources",
      recommendedResources: "Recommended Resources",
      contributionStats: "Contribution Stats",
      recentActivity: "Recent Activity",
      noUploadedResources: "No resources uploaded yet",
      noRecommendedResources: "No recommended resources",
      noRecentActivity: "No recent activity",
      resourcesDownloaded: "Resources Downloaded",
      resourcesUploaded: "Resources Uploaded",
      reviewsWritten: "Reviews Written",
      currentLevel: "Current Level",
      uploadedBy: "Uploaded by",
      uploadedResource: "Uploaded",
      dataLoadError: "Failed to load dashboard data. Please try again later.",
      averageRating: "Average Rating",
      leaderboardRank: "Leaderboard Rank",
      seeAll: "See All",
    },
    navbar: {
      appName: "Knowledge Hub",
      home: "Home",
      resources: "Resources",
      leaderboard: "Leaderboard",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      profile: "Profile",
    },
    profile: {
      level: "Level",
      points: "Points",
      tabs: {
        resources: "Resources",
        badges: "Badges",
        contributions: "Contributions",
      },
      noResources: "No resources uploaded yet",
      noContributions: "No contributions found",
      uploadDate: "Uploaded",
      editResource: "Edit",
      downloads: "Downloads",
      progressLabel: "Progress",
      contributionTypes: {
        upload: "Resource Upload",
        review: "Resource Review",
      },
    },
  },
  ar: {
    common: {
      error: "حدث خطأ",
      loading: "جار التحميل...",
      submit: "إرسال",
      cancel: "إلغاء",
      select: "اختيار",
    },
    auth: {
      login: {
        title: "تسجيل الدخول إلى حسابك",
        email: "البريد الإلكتروني",
        emailLabel: "البريد الإلكتروني",
        passwordLabel: "كلمة المرور",
        signupPrompt: "ليس لديك حساب؟",
        signupLink: "إنشاء حساب",
        languageToggle: "English",
        loginSuccess: "تم تسجيل الدخول بنجاح",
        loginError: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        loginButton: "تسجيل الدخول",
        password: "كلمة المرور",
      },
      signup: {
        title: "إنشاء حسابك",
        nameLabel: "الاسم الكامل",
        emailLabel: "البريد الإلكتروني",
        passwordLabel: "كلمة المرور",
        confirmPasswordLabel: "تأكيد كلمة المرور",
        signupButton: "إنشاء حساب",
        loginPrompt: "لديك حساب بالفعل؟",
        loginLink: "تسجيل الدخول",
        languageToggle: "عربي",
        signupSuccess: "تم إنشاء الحساب بنجاح",
        passwordMismatch: "كلمات المرور غير متطابقة",
      },
      logout: {
        title: "تسجيل الخروج",
      },
    },
    resources: {
      upload: {
        title: "رفع مورد",
        description: "شارك معرفتك مع المجتمع",
        uploadError: "فشل رفع المورد. يرجى المحاولة مرة أخرى.",
        form: {
          title: "عنوان المورد",
          titlePlaceholder: "أدخل عنوانًا وصفيًا",
          type: "نوع المورد",
          category: "الفئة",
          file: "رفع الملف",
          fileHelp: "التنسيقات المدعومة: PDF, DOCX, PPTX, MP4",
          description: "الوصف",
          descriptionPlaceholder: "قدم نظرة عامة موجزة عن المورد",
          tags: "الكلمات الدلالية",
          tagsPlaceholder:
            "أضف كلمات دلالية ذات صلة لمساعدة الآخرين على العثور على مواردك",
        },
        validation: {
          titleRequired: "العنوان مطلوب",
          typeRequired: "نوع المورد مطلوب",
          categoryRequired: "الفئة مطلوبة",
          fileRequired: "الملف مطلوب",
          fileSizeLimit: "يجب أن يكون حجم الملف أقل من 50 ميجابايت",
          fileTypeInvalid: "نوع الملف غير صالح",
        },
        success: "تم رفع المورد بنجاح!",
        error: "فشل رفع المورد. يرجى المحاولة مرة أخرى.",
      },
      search: {
        placeholder: "البحث عن الموارد...",
        filters: {
          type: "نوع المورد",
          category: "الفئة",
          sortBy: "ترتيب حسب",
          sortOptions: {
            newest: "الأحدث",
            mostDownloaded: "الأكثر تنزيلًا",
            highestRated: "الأعلى تقييمًا",
          },
        },
      },
      details: {
        downloadButton: "تنزيل المورد",
        downloadError: "فشل تنزيل المورد",
        deleteSuccess: "تم حذف المورد بنجاح",
        deleteError: "فشل حذف المورد",
        writeReview: "كتابة مراجعة",
        uploadResource: "رفع المورد",
        rating: "التقييم",
        comment: "التعليق",
        submitReview: "إرسال المراجعة",
        reviews: "المراجعات",
        noReviews: "لا توجد مراجعات بعد.",
        deleteConfirmation: {
          title: "حذف المورد",
          message:
            "هل أنت متأكد من رغبتك في حذف هذا المورد؟ لا يمكن التراجع عن هذا الإجراء.",
          cancelButton: "إلغاء",
          deleteButton: "حذف",
        },
      },
    },
    subjects: {
      image_processing: "تحليل الصور",
      medical_equipment: "تجهيزات طبية",
      biostatistics: "الاحصاء الحيوي",
      digital_control: "التحكم الرقمي",
      medical_planning: "تخطيط طبي",
    },
    topics: {
      calculus: "التفاضل والتكامل",
      algebra: "الجبر",
      mechanics: "الميكانيكا",
      organicChemistry: "الكيمياء العضوية",
      programming: "البرمجة",
    },
    leaderboard: {
      title: "لوحة المتصدرين",
      noContributors: "لم يتم العثور على مساهمين",
      level: "المستوى",
      points: "النقاط",
      sortBy: {
        points: "ترتيب حسب النقاط",
        level: "ترتيب حسب المستوى",
      },
      filters: {
        all: "الكل",
        weekly: "أسبوعي",
        monthly: "شهري",
      },
      badges: {
        "Rookie Uploader": "شارة المرفع المبتدئ",
        "Resource Master": "شارة سيد الموارد",
        "Knowledge Sharer": "شارة مشارك المعرفة",
        "Helpful Reviewer": "شارة المراجع المساعد",
      },
      badgeDescriptions: {
        "Rookie Uploader":
          "الخطوات الأولى في مشاركة المعرفة! قام بتحميل أول مورد.",
        "Resource Master": "مساهمات متسقة ذات جودة عالية للموارد.",
        "Knowledge Sharer": "مشاركة نشطة للمعرفة القيمة مع المجتمع.",
        "Helpful Reviewer": "تقديم مراجعات ذات رؤى بناءة.",
      },
      columns: {
        rank: "الترتيب",
        user: "المستخدم",
        contributions: "المساهمات",
        badges: "الشارات",
        progress: "التقدم",
        level: "المستوى",
        points: "النقاط",
      },
      stats: {
        totalContributors: "إجمالي المساهمين",
        topContributor: "أفضل مساهم",
        averagePoints: "متوسط النقاط",
      },
      tooltips: {
        levelTooltip: "المستوى {{level}}",
        pointsBreakdown: "إجمالي نقاط المساهمة: {{points}}",
        badgeProgress: "تقدم الشارات",
        badgeProgressTooltip: "انقر لرؤية تفاصيل تقدم الشارات",
      },
    },
    dashboard: {
      uploadedResources: "الموارد المرفوعة",
      recommendedResources: "الموارد الموصى بها",
      contributionStats: "إحصائيات المساهمة",
      recentActivity: "النشاط الأخير",
      noUploadedResources: "لم يتم رفع أي موارد بعد",
      noRecommendedResources: "لا توجد موارد موصى بها",
      noRecentActivity: "لا توجد أنشطة حديثة",
      resourcesDownloaded: "الموارد المُنزلة",
      resourcesUploaded: "الموارد المرفوعة",
      reviewsWritten: "المراجعات المكتوبة",
      currentLevel: "المستوى الحالي",
      uploadedBy: "رفعه",
      uploadedResource: "رفع",
      dataLoadError:
        "فشل تحميل بيانات لوحة المعلومات. يرجى المحاولة مرة أخرى لاحقًا.",
      averageRating: "التقييم المتوسط",
      leaderboardRank: "الترتيب في لوحة المتصدرين",
      seeAll: "عرض الكل",
    },
    navbar: {
      appName: "مركز المعرفة",
      home: "الرئيسية",
      resources: "الموارد",
      leaderboard: "لوحة المتصدرين",
      login: "تسجيل الدخول",
      signup: "إنشاء حساب",
      logout: "تسجيل الخروج",
      profile: "الملف الشخصي",
    },
    profile: {
      level: "المستوى",
      points: "النقاط",
      tabs: {
        resources: "الموارد",
        badges: "الشارات",
        contributions: "المساهمات",
      },
      noResources: "لم يتم رفع أي موارد بعد",
      noContributions: "لم يتم العثور على مساهمات",
      uploadDate: "تم الرفع",
      editResource: "تعديل",
      downloads: "التنزيلات",
      progressLabel: "التقدم",
      contributionTypes: {
        upload: "رفع مورد",
        review: "مراجعة مورد",
      },
    },
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider(props) {
  const [language, setLanguage] = useState(() => {
    // Check localStorage for saved language preference
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage || "en";
  });

  // Comprehensive logging
  useEffect(() => {
    console.log("LanguageProvider props:", props);
    console.log("Children type:", typeof props.children);
    console.log("Children:", props.children);

    // Detailed error logging
    if (!props.children) {
      console.error("No children passed to LanguageProvider");
      console.trace("Children trace");
    }
  }, [props.children]);

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "ar" : "en";
    setLanguage(newLanguage);
    localStorage.setItem("language", newLanguage);
  };

  const t = (key) => {
    // Validate input
    if (!key || typeof key !== "string") {
      console.warn("Invalid translation key:", key);
      return key;
    }

    // Split the key into parts
    const keys = key.split(".");

    // Traverse the translations object
    let translation = translations[language];
    for (const k of keys) {
      if (translation && typeof translation === "object") {
        translation = translation[k];
      } else {
        // If translation is not found, return the key
        console.warn(`Translation not found for key: ${key}`);
        return key;
      }
    }

    // Ensure the translation is a string
    if (translation === undefined || translation === null) {
      console.warn(`Translation is null or undefined for key: ${key}`);
      return key;
    }

    // Return the translation or the original key if not found
    return translation;
  };

  // Minimal rendering with error handling
  try {
    // Validate children
    if (!props.children) {
      throw new Error("No children provided to LanguageProvider");
    }

    return (
      <LanguageContext.Provider
        value={{
          language,
          toggleLanguage,
          t,
        }}
      >
        {props.children}
      </LanguageContext.Provider>
    );
  } catch (error) {
    console.error("Error rendering LanguageProvider:", error);
    return null;
  }
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
