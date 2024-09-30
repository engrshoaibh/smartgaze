const batches = [
    { value: '', label: 'Select Batch' },
    { value: 'sp24', label: 'Spring 2024 (SP24)' },
    { value: 'fa24', label: 'Fall 2024 (FA24)' },
    { value: 'fa23', label: 'Fall 2023 (FA23)' },
    { value: 'sp23', label: 'Spring 2023 (SP23)' },
    { value: 'fa22', label: 'Fall 2022 (FA22)' },
    { value: 'sp22', label: 'Spring 2022 (SP22)' },
    { value: 'fa21', label: 'Fall 2021 (FA21)' },
    { value: 'sp21', label: 'Spring 2021 (SP21)' }
  ];

const departments = [
    { value: '', label: 'Select Department' },
    { value: 'cs', label: 'Computer Science' },
    { value: 'ee', label: 'Electrical Engineering' },
    { value: 'me', label: 'Mechanical Engineering' },
    { value: 'ce', label: 'Civil Engineering' },
    { value: 'ba', label: 'Business Administration' },
    { value: 'math', label: 'Mathematics' },
    { value: 'phy', label: 'Physics' },
    { value: 'che', label: 'Chemistry' },
    { value: 'bio', label: 'Biology' },
    { value: 'soc', label: 'Social Sciences' },
    { value: 'hum', label: 'Humanities' },
    { value: 'law', label: 'Law' },
    { value: 'arch', label: 'Architecture' },
    { value: 'media', label: 'Media and Communication' }
  ]


  const departmentClasses = {
    cs: [
      { value: '', label: 'Select Class' },
      { value: 'bse', label: 'Bachelor of Software Engineering (BSE)' },
      { value: 'bcs', label: 'Bachelor of Computer Science (BCS)' },
      { value: 'bai', label: 'Bachelor of Artificial Intelligence (BAI)' },
      { value: 'bds', label: 'Bachelor of Data Science (BDS)' }
    ],
    ee: [
      { value: '', label: 'Select Class' },
      { value: 'bsee', label: 'Bachelor of Science in Electrical Engineering (BSEE)' }
    ],
    me: [
      { value: '', label: 'Select Class' },
      { value: 'bsme', label: 'Bachelor of Science in Mechanical Engineering (BSME)' }
    ],
    ce: [
      { value: '', label: 'Select Class' },
      { value: 'bsce', label: 'Bachelor of Science in Civil Engineering (BSCE)' }
    ],
    ba: [
      { value: '', label: 'Select Class' },
      { value: 'bba', label: 'Bachelor of Business Administration (BBA)' }
    ],
    math: [
      { value: '', label: 'Select Class' },
      { value: 'bsmath', label: 'Bachelor of Science in Mathematics (BS Math)' }
    ],
    phy: [
      { value: '', label: 'Select Class' },
      { value: 'bsphy', label: 'Bachelor of Science in Physics (BS Physics)' }
    ],
    che: [
      { value: '', label: 'Select Class' },
      { value: 'bsche', label: 'Bachelor of Science in Chemistry (BS Chemistry)' }
    ],
    bio: [
      { value: '', label: 'Select Class' },
      { value: 'bsbio', label: 'Bachelor of Science in Biology (BS Biology)' }
    ],
    soc: [
      { value: '', label: 'Select Class' },
      { value: 'bapsych', label: 'Bachelor of Arts in Psychology (BAP)' },
      { value: 'bas', label: 'Bachelor of Arts in Sociology (BAS)' },
      { value: 'bses', label: 'Bachelor of Science in Environmental Science (BSES)' },
      { value: 'bed', label: 'Bachelor of Education (BEd)' }
    ],
    hum: [
      { value: '', label: 'Select Class' },
      { value: 'baeng', label: 'Bachelor of Arts in English Literature (BA English)' }
    ],
    law: [
      { value: '', label: 'Select Class' },
      { value: 'llb', label: 'Bachelor of Laws (LLB)' }
    ],
    arch: [
      { value: '', label: 'Select Class' },
      { value: 'barch', label: 'Bachelor of Architecture (BArch)' }
    ],
    media: [
      { value: '', label: 'Select Class' },
      { value: 'bms', label: 'Bachelor of Media Studies (BMS)' }
    ]
  };
export default {batches, departments, departmentClasses};