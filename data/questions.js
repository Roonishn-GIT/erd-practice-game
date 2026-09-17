const erdQuestions = [
  {
    id: 1,
    topic: "Optionality",
    difficulty: "Foundation",
    question: "Can a CUSTOMER instance exist without any related ORDER records?",
    choices: ["Yes, the relationship allows zero related orders", "No, every customer needs one order", "No, every customer needs many orders", "Only if the order has no primary key"],
    answer: "Yes, the relationship allows zero related orders",
    explanation: "The circle and crow's foot next to ORDER mean a CUSTOMER can be related to zero or many ORDER records. The two bars next to CUSTOMER mean each ORDER must be related to exactly one CUSTOMER.",
    diagram: { leftEntity: { name: "CUSTOMER", marker: "exactly-one", attributes: [{ key: "PK", name: "customer_id" }, { name: "name" }, { name: "email" }] }, rightEntity: { name: "ORDER", marker: "zero-many", attributes: [{ key: "PK", name: "order_id" }, { key: "FK", name: "customer_id" }, { name: "ordered_at" }] } }
  },
  {
    id: 2,
    topic: "Maximum cardinality",
    difficulty: "Foundation",
    question: "What is the maximum number of PROFILE records that can be related to one CUSTOMER?",
    choices: ["Zero", "One", "Many", "It cannot be determined from the diagram"],
    answer: "One",
    explanation: "The circle and bar next to PROFILE mean a CUSTOMER can be related to zero or one PROFILE. The two bars next to CUSTOMER mean each PROFILE must be related to exactly one CUSTOMER.",
    diagram: { leftEntity: { name: "CUSTOMER", marker: "exactly-one", attributes: [{ key: "PK", name: "customer_id" }, { name: "name" }, { name: "joined_at" }] }, rightEntity: { name: "PROFILE", marker: "zero-one", attributes: [{ key: "PK", name: "profile_id" }, { key: "FK", name: "customer_id" }, { name: "avatar_url" }] } }
  },
  {
    id: 3,
    topic: "Relationship type",
    difficulty: "Intermediate",
    question: "How should the relationship between AUTHOR and BOOK be classified?",
    choices: ["One-to-one", "One-to-many", "Many-to-many", "Zero-to-one"],
    answer: "Many-to-many",
    explanation: "The crow's foot with a circle next to BOOK means an AUTHOR can be related to zero or many BOOK records. The crow's foot with a circle next to AUTHOR means a BOOK can be related to zero or many AUTHOR records. Together, that is many-to-many.",
    diagram: { leftEntity: { name: "AUTHOR", marker: "zero-many", attributes: [{ key: "PK", name: "author_id" }, { name: "name" }, { name: "bio" }] }, rightEntity: { name: "BOOK", marker: "zero-many", attributes: [{ key: "PK", name: "book_id" }, { name: "title" }, { name: "published_on" }] } }
  },
  {
    id: 4,
    topic: "Optionality",
    difficulty: "Intermediate",
    question: "Can an EMPLOYEE be recorded before a PARKING_SPOT is assigned?",
    choices: ["Yes, an employee may have zero or one parking spot", "No, every employee needs exactly one parking spot", "Yes, an employee must have many parking spots", "Only when the parking spot has a foreign key"],
    answer: "Yes, an employee may have zero or one parking spot",
    explanation: "The circle and bar next to PARKING_SPOT mean an EMPLOYEE can have zero or one PARKING_SPOT. The two bars next to EMPLOYEE mean each PARKING_SPOT must be assigned to exactly one EMPLOYEE.",
    diagram: { leftEntity: { name: "EMPLOYEE", marker: "exactly-one", attributes: [{ key: "PK", name: "employee_id" }, { name: "name" }, { name: "role" }] }, rightEntity: { name: "PARKING_SPOT", marker: "zero-one", attributes: [{ key: "PK", name: "spot_id" }, { key: "FK", name: "employee_id" }, { name: "floor" }] } }
  },
  {
    id: 5,
    topic: "Business rules",
    difficulty: "Intermediate",
    question: "Which business rule is supported by this PRODUCT and ORDER_ITEM relationship?",
    choices: ["A product can never appear on an order", "A product may appear on many order items, while each order item names one product", "An order item must name many products", "Each product must have exactly one order item"],
    answer: "A product may appear on many order items, while each order item names one product",
    explanation: "The circle and crow's foot next to ORDER_ITEM mean a PRODUCT can be related to zero or many ORDER_ITEM records. The two bars next to PRODUCT mean each ORDER_ITEM must be related to exactly one PRODUCT.",
    diagram: { leftEntity: { name: "PRODUCT", marker: "zero-many", attributes: [{ key: "PK", name: "product_id" }, { name: "name" }, { name: "unit_price" }] }, rightEntity: { name: "ORDER_ITEM", marker: "exactly-one", attributes: [{ key: "PK", name: "item_id" }, { key: "FK", name: "product_id" }, { name: "quantity" }] } }
  },
  {
    id: 6,
    topic: "Minimum cardinality",
    difficulty: "Intermediate",
    question: "What is the minimum number of PROJECT records related to a TASK?",
    choices: ["Zero", "One", "Many", "The diagram does not show a minimum"],
    answer: "One",
    explanation: "The bar and crow's foot next to PROJECT mean a TASK must be related to one or many PROJECT records, so its minimum is one. The circle and crow's foot next to TASK mean a PROJECT may be related to zero or many TASK records.",
    diagram: { leftEntity: { name: "PROJECT", marker: "one-many", attributes: [{ key: "PK", name: "project_id" }, { name: "name" }, { name: "status" }] }, rightEntity: { name: "TASK", marker: "zero-many", attributes: [{ key: "PK", name: "task_id" }, { name: "summary" }, { name: "due_date" }] } }
  },
  {
    id: 7,
    topic: "Relationship type",
    difficulty: "Intermediate",
    question: "Does this model accommodate the rule 'a DEPARTMENT may exist before any EMPLOYEE is hired, and an EMPLOYEE may be unassigned'?",
    choices: ["Yes, both ends allow zero related records", "No, every department needs one employee", "No, every employee needs many departments", "Only if department_id is a primary key"],
    answer: "Yes, both ends allow zero related records",
    explanation: "The circle and crow's foot next to EMPLOYEE mean a DEPARTMENT can be related to zero or many EMPLOYEE records. The circle and bar next to DEPARTMENT mean an EMPLOYEE can be related to zero or one DEPARTMENT. Both stated zero cases are supported.",
    diagram: { leftEntity: { name: "DEPARTMENT", marker: "zero-many", attributes: [{ key: "PK", name: "department_id" }, { name: "name" }, { name: "budget" }] }, rightEntity: { name: "EMPLOYEE", marker: "zero-one", attributes: [{ key: "PK", name: "employee_id" }, { key: "FK", name: "department_id" }, { name: "name" }] } }
  },
    {
      id: 8,
      topic: "Foreign keys",
      difficulty: "Foundation",
      question: "Which entity contains the foreign key that implements this CUSTOMER-ORDER relationship?",
      choices: ["CUSTOMER", "ORDER", "Both entities", "Neither entity"],
      answer: "ORDER",
      explanation: "ORDER contains customer_id marked FK, which references CUSTOMER.customer_id marked PK. The FK is stored on the many-side entity in this one-to-many relationship.",
      diagram: { leftEntity: { name: "CUSTOMER", marker: "exactly-one", attributes: [{ key: "PK", name: "customer_id" }, { name: "name" }] }, rightEntity: { name: "ORDER", marker: "zero-many", attributes: [{ key: "PK", name: "order_id" }, { key: "FK", name: "customer_id" }, { name: "ordered_at" }] } }
    },
    {
      id: 9,
      topic: "Participation",
      difficulty: "Foundation",
      question: "Is participation mandatory for an INVOICE on this relationship?",
      choices: ["Yes, each invoice must relate to one or more line items", "No, an invoice may have no line items", "Yes, each invoice has exactly one line item", "The diagram shows only attribute optionality"],
      answer: "Yes, each invoice must relate to one or more line items",
      explanation: "The bar and Crow's Foot next to LINE_ITEM mean an INVOICE must have one or many LINE_ITEM records. The two bars next to INVOICE mean every LINE_ITEM belongs to exactly one INVOICE. Both ends make invoice participation mandatory.",
      diagram: { leftEntity: { name: "INVOICE", marker: "exactly-one", attributes: [{ key: "PK", name: "invoice_id" }, { name: "issued_on" }] }, rightEntity: { name: "LINE_ITEM", marker: "one-many", attributes: [{ key: "PK", name: "line_id" }, { key: "FK", name: "invoice_id" }, { name: "amount" }] } }
    },
    {
      id: 10,
      topic: "Multiple relationships",
      difficulty: "Advanced",
      question: "What is the maximum number of COURSE records a PROFESSOR can teach in this relationship?",
      choices: ["Exactly one", "Zero or one", "Many", "It is not a relationship"],
      answer: "Many",
      explanation: "The Crow's Foot at the COURSE end means one PROFESSOR can be connected to many COURSE records. The bar at the PROFESSOR end means each COURSE has exactly one professor for this relationship.",
      diagram: { leftEntity: { name: "PROFESSOR", marker: "exactly-one", attributes: [{ key: "PK", name: "professor_id" }, { name: "name" }] }, rightEntity: { name: "COURSE", marker: "zero-many", attributes: [{ key: "PK", name: "course_id" }, { key: "FK", name: "professor_id" }, { name: "title" }] } }
    },
    {
      id: 11,
      topic: "Associative entities",
      difficulty: "Advanced",
      question: "Why would an ENROLLMENT entity be needed between STUDENT and COURSE?",
      choices: ["To resolve the many-to-many association and store enrollment attributes", "To make COURSE a primary key", "To remove the relationship", "To make every student take one course"],
      answer: "To resolve the many-to-many association and store enrollment attributes",
      explanation: "Both STUDENT and COURSE show many participation, so ENROLLMENT resolves the many-to-many association into two relationships. It can hold enrollment_date or grade that belongs to the pairing.",
      diagram: { leftEntity: { name: "STUDENT", marker: "zero-many", attributes: [{ key: "PK", name: "student_id" }, { name: "name" }] }, rightEntity: { name: "COURSE", marker: "zero-many", attributes: [{ key: "PK", name: "course_id" }, { name: "title" }] } }
    },
    {
      id: 12,
      topic: "Composite identifiers",
      difficulty: "Advanced",
      question: "Which pair would identify an ENROLLMENT instance when one student may take many courses and one course may have many students?",
      choices: ["student_id and course_id together", "student_name only", "course_title only", "enrolled_on only"],
      answer: "student_id and course_id together",
      explanation: "An associative entity represents one pairing. The two foreign keys together form a composite identifier for that pairing; either key alone would repeat.",
      diagram: { leftEntity: { name: "STUDENT", marker: "zero-many", attributes: [{ key: "PK", name: "student_id" }, { name: "name" }] }, rightEntity: { name: "COURSE", marker: "zero-many", attributes: [{ key: "PK", name: "course_id" }, { name: "title" }] } }
    },
    {
      id: 13,
      topic: "Business rules",
      difficulty: "Advanced",
      question: "Which change would be required to support the rule 'each ACCOUNT must have at least one CONTACT, but a CONTACT may be unassigned'?",
      choices: ["ACCOUNT's related CONTACT end must be mandatory many, and CONTACT's ACCOUNT end optional one", "Both ends must be exactly one", "Both ends must be optional many", "Remove the ACCOUNT identifier"],
      answer: "ACCOUNT's related CONTACT end must be mandatory many, and CONTACT's ACCOUNT end optional one",
      explanation: "The ACCOUNT-to-CONTACT side needs |{ so every ACCOUNT has at least one CONTACT. The CONTACT-to-ACCOUNT side needs o| so a CONTACT may have zero or one ACCOUNT. Both ends must be read separately.",
      diagram: { leftEntity: { name: "ACCOUNT", marker: "one-many", attributes: [{ key: "PK", name: "account_id" }, { name: "name" }] }, rightEntity: { name: "CONTACT", marker: "zero-one", attributes: [{ key: "PK", name: "contact_id" }, { key: "FK", name: "account_id" }, { name: "email" }] } }
    },
    {
      id: 14,
      topic: "Multiple relationships",
      difficulty: "Advanced",
      question: "Can the same FLIGHT instance participate in both a DEPARTS_FROM and an ARRIVES_AT relationship to AIRPORT?",
      choices: ["Yes, one entity type can participate in more than one relationship type", "No, an entity can only have one relationship", "Only if AIRPORT has no primary key", "Only if both relationships are many-to-many"],
      answer: "Yes, one entity type can participate in more than one relationship type",
      explanation: "The course model allows entity types to be related in more than one way. Separate relationships can carry different roles or business meanings even when they use the same entity types.",
      diagram: { leftEntity: { name: "FLIGHT", marker: "exactly-one", attributes: [{ key: "PK", name: "flight_id" }, { key: "FK", name: "depart_airport" }, { key: "FK", name: "arrive_airport" }] }, rightEntity: { name: "AIRPORT", marker: "zero-many", attributes: [{ key: "PK", name: "airport_code" }, { name: "city" }] } }
    },
  {
    id: 15,
    topic: "Independent existence",
    difficulty: "Foundation",
    question: "Can a library BOOK_COPY exist before a MEMBER checks it out?",
    choices: ["Yes, the circle at CHECKOUT permits zero current checkouts", "No, every copy needs exactly one checkout", "No, every copy needs many checkouts", "The primary key decides this"],
    answer: "Yes, the circle at CHECKOUT permits zero current checkouts",
    explanation: "The circle and bar next to CHECKOUT mean a BOOK_COPY can have zero or one current checkout. The two bars next to BOOK_COPY mean every CHECKOUT belongs to exactly one copy. The circle at the CHECKOUT end is what permits an unused copy.",
    diagram: { leftEntity: { name: "BOOK_COPY", marker: "exactly-one", attributes: [{ key: "PK", name: "copy_id" }, { key: "FK", name: "book_id" }, { name: "condition" }] }, rightEntity: { name: "CHECKOUT", marker: "zero-one", attributes: [{ key: "PK", name: "checkout_id" }, { key: "FK", name: "copy_id" }, { name: "returned_on" }] } }
  },
  {
    id: 16,
    topic: "Maximum cardinality",
    difficulty: "Foundation",
    question: "What is the maximum number of DOCTORS associated with one PATIENT in this care-team relationship?",
    choices: ["Zero", "One", "Many", "Exactly two"],
    answer: "Many",
    explanation: "The crow's foot next to DOCTOR means one PATIENT can be associated with many DOCTOR records. The circle next to PATIENT means a DOCTOR may have zero patients in this particular relationship. Read the endpoint beside the records being counted.",
    diagram: { leftEntity: { name: "PATIENT", marker: "zero-many", attributes: [{ key: "PK", name: "patient_id" }, { name: "name" }] }, rightEntity: { name: "DOCTOR", marker: "zero-many", attributes: [{ key: "PK", name: "doctor_id" }, { name: "specialty" }] } }
  },
  {
    id: 17,
    topic: "PK/FK placement",
    difficulty: "Intermediate",
    question: "Which attribute implements the relationship from a BANK_ACCOUNT to its BRANCH?",
    choices: ["BRANCH.branch_id as FK", "BANK_ACCOUNT.branch_id as FK", "BANK_ACCOUNT.account_id as FK", "Neither entity needs a key reference"],
    answer: "BANK_ACCOUNT.branch_id as FK",
    explanation: "The bar next to BRANCH means each BANK_ACCOUNT belongs to exactly one BRANCH, while the crow's foot next to BANK_ACCOUNT means one BRANCH can have many accounts. BANK_ACCOUNT.branch_id is therefore the foreign key referencing BRANCH.branch_id; account_id remains the account's primary key.",
    diagram: { leftEntity: { name: "BRANCH", marker: "exactly-one", attributes: [{ key: "PK", name: "branch_id" }, { name: "city" }] }, rightEntity: { name: "BANK_ACCOUNT", marker: "zero-many", attributes: [{ key: "PK", name: "account_id" }, { key: "FK", name: "branch_id" }, { name: "opened_on" }] } }
  },
  {
    id: 18,
    topic: "Business rule",
    difficulty: "Intermediate",
    question: "Does this ERD support the rule 'a TRIP may have no RESERVATION yet, but every RESERVATION names one TRIP'?",
    choices: ["Yes, the circle/crow's foot is at TRIP and the bar is at RESERVATION", "No, both ends are mandatory", "No, a reservation can name many trips", "Only if TRIP has a composite key"],
    answer: "Yes, the circle/crow's foot is at TRIP and the bar is at RESERVATION",
    explanation: "The crow's foot with a circle next to RESERVATION means a TRIP may have zero or many reservations. The two bars next to TRIP mean every RESERVATION belongs to exactly one trip. Both parts of the stated rule match.",
    diagram: { leftEntity: { name: "TRIP", marker: "exactly-one", attributes: [{ key: "PK", name: "trip_id" }, { name: "destination" }] }, rightEntity: { name: "RESERVATION", marker: "zero-many", attributes: [{ key: "PK", name: "reservation_id" }, { key: "FK", name: "trip_id" }, { name: "reserved_on" }] } }
  },
  {
    id: 19,
    topic: "Associative entity",
    difficulty: "Advanced",
    question: "Which model change is needed to store the quantity of each COMPONENT used in a PRODUCT?",
    choices: ["Introduce PRODUCT_COMPONENT as an associative entity", "Put one component_id directly on PRODUCT", "Make COMPONENT a multivalued attribute", "Remove the PRODUCT identifier"],
    answer: "Introduce PRODUCT_COMPONENT as an associative entity",
    explanation: "A PRODUCT can use many COMPONENTs and a COMPONENT can appear in many PRODUCTs. PRODUCT_COMPONENT resolves that many-to-many relationship into two one-to-many relationships and provides a place for quantity. The associative entity's two foreign keys can form a composite key.",
    diagram: { leftEntity: { name: "PRODUCT", marker: "zero-many", attributes: [{ key: "PK", name: "product_id" }, { name: "name" }] }, rightEntity: { name: "COMPONENT", marker: "zero-many", attributes: [{ key: "PK", name: "component_id" }, { name: "description" }] } }
  },
  {
    id: 20,
    topic: "Multi-step reasoning",
    difficulty: "Advanced",
    question: "A MEMBER may join many CLUBs and each CLUB may have many MEMBERs. Which statement follows from the diagram?",
    choices: ["MEMBERSHIP is needed if the pairing has joined_on or role", "Each member can join only one club", "A club cannot exist without a member", "CLUB.club_id belongs as a foreign key in MEMBER only"],
    answer: "MEMBERSHIP is needed if the pairing has joined_on or role",
    explanation: "Both ends show zero or many, so the direct relationship is many-to-many. An associative MEMBERSHIP entity resolves it into MEMBER-to-MEMBERSHIP and CLUB-to-MEMBERSHIP relationships and stores attributes belonging to the pairing, such as joined_on or role.",
    diagram: { leftEntity: { name: "MEMBER", marker: "zero-many", attributes: [{ key: "PK", name: "member_id" }, { name: "name" }] }, rightEntity: { name: "CLUB", marker: "zero-many", attributes: [{ key: "PK", name: "club_id" }, { name: "name" }] } }
  }
];
