const buildChallenges = [
  {
    id: 1,
    difficulty: "Foundation",
    topic: "One-to-many relationship",
    scenario: "A CUSTOMER may place many ORDERs. Every ORDER must belong to exactly one CUSTOMER. Each ORDER stores its order_id and references the customer that placed it.",
    entities: [
      { name: "CUSTOMER", attributes: ["customer_id", "name"] },
      { name: "ORDER", attributes: ["order_id", "customer_id", "ordered_at"] }
    ],
    relationships: [{ left: "CUSTOMER", right: "ORDER", leftMarker: "exactly-one", rightMarker: "zero-many" }],
    keys: [
      { entity: "CUSTOMER", attribute: "customer_id", role: "PK" },
      { entity: "ORDER", attribute: "order_id", role: "PK" },
      { entity: "ORDER", attribute: "customer_id", role: "FK" }
    ],
    explanation: "CUSTOMER is the one-side and ORDER is the many-side. The CUSTOMER end is || because every ORDER has exactly one CUSTOMER; the ORDER end is o{ because a CUSTOMER may have zero or many orders. ORDER.customer_id is the foreign key to CUSTOMER.customer_id."
  },
  {
    id: 2,
    difficulty: "Intermediate",
    topic: "Mandatory department membership",
    scenario: "A DEPARTMENT employs one or more EMPLOYEEs. Each EMPLOYEE belongs to exactly one DEPARTMENT. A department and an employee must each have a stable identifier.",
    entities: [
      { name: "DEPARTMENT", attributes: ["department_id", "name"] },
      { name: "EMPLOYEE", attributes: ["employee_id", "department_id", "name"] }
    ],
    relationships: [{ left: "DEPARTMENT", right: "EMPLOYEE", leftMarker: "exactly-one", rightMarker: "one-many" }],
    keys: [
      { entity: "DEPARTMENT", attribute: "department_id", role: "PK" },
      { entity: "EMPLOYEE", attribute: "employee_id", role: "PK" },
      { entity: "EMPLOYEE", attribute: "department_id", role: "FK" }
    ],
    explanation: "The EMPLOYEE end is |{, so every DEPARTMENT must employ one or more employees. The DEPARTMENT end is ||, so every EMPLOYEE belongs to exactly one department. EMPLOYEE.department_id implements that relationship as a foreign key."
  },
  {
    id: 3,
    difficulty: "Advanced",
    topic: "Associative entity and composite key",
    scenario: "A STUDENT may take many COURSEs, and a COURSE may have many STUDENTs. The enrollment date belongs to the pairing, so model the many-to-many relationship with an associative ENROLLMENT entity. One student-course pairing can appear only once.",
    entities: [
      { name: "STUDENT", attributes: ["student_id", "name"] },
      { name: "COURSE", attributes: ["course_id", "title"] },
      { name: "ENROLLMENT", attributes: ["student_id", "course_id", "enrolled_on"] }
    ],
    relationships: [
      { left: "STUDENT", right: "ENROLLMENT", leftMarker: "exactly-one", rightMarker: "zero-many" },
      { left: "COURSE", right: "ENROLLMENT", leftMarker: "exactly-one", rightMarker: "zero-many" }
    ],
    keys: [
      { entity: "STUDENT", attribute: "student_id", role: "PK" },
      { entity: "COURSE", attribute: "course_id", role: "PK" },
      { entity: "ENROLLMENT", attribute: "student_id", role: "PK/FK" },
      { entity: "ENROLLMENT", attribute: "course_id", role: "PK/FK" }
    ],
    explanation: "STUDENT and COURSE are connected through ENROLLMENT because the original association is many-to-many. Each ENROLLMENT belongs to exactly one STUDENT and exactly one COURSE, while either parent can have zero or many enrollments. The two foreign keys form ENROLLMENT's composite primary key."
  },
  {
    id: 4,
    difficulty: "Intermediate",
    topic: "Hospital care team",
    scenario: "A PATIENT may have zero or many APPOINTMENTs. Each APPOINTMENT belongs to exactly one PATIENT and exactly one DOCTOR. A DOCTOR may have zero or many APPOINTMENTs. Identify each entity and both relationships.",
    entities: [
      { name: "PATIENT", attributes: ["patient_id", "name"] },
      { name: "DOCTOR", attributes: ["doctor_id", "name", "specialty"] },
      { name: "APPOINTMENT", attributes: ["appointment_id", "patient_id", "doctor_id", "scheduled_at"] }
    ],
    relationships: [
      { left: "PATIENT", right: "APPOINTMENT", leftMarker: "exactly-one", rightMarker: "zero-many" },
      { left: "DOCTOR", right: "APPOINTMENT", leftMarker: "exactly-one", rightMarker: "zero-many" }
    ],
    keys: [
      { entity: "PATIENT", attribute: "patient_id", role: "PK" },
      { entity: "DOCTOR", attribute: "doctor_id", role: "PK" },
      { entity: "APPOINTMENT", attribute: "appointment_id", role: "PK" },
      { entity: "APPOINTMENT", attribute: "patient_id", role: "FK" },
      { entity: "APPOINTMENT", attribute: "doctor_id", role: "FK" }
    ],
    explanation: "APPOINTMENT is the child of both PATIENT and DOCTOR. Each appointment points to exactly one patient and doctor, while either parent can have zero or many appointments. The two appointment foreign keys implement the two relationships."
  },
  {
    id: 5,
    difficulty: "Advanced",
    topic: "Retail promotion assignments",
    scenario: "A PRODUCT may appear in many PROMOTIONs, and a PROMOTION may apply to many PRODUCTs. The discount_rate belongs to each product-promotion pairing, so resolve the many-to-many relationship with PRODUCT_PROMOTION. A pairing is unique by product and promotion.",
    entities: [
      { name: "PRODUCT", attributes: ["product_id", "name"] },
      { name: "PROMOTION", attributes: ["promotion_id", "label"] },
      { name: "PRODUCT_PROMOTION", attributes: ["product_id", "promotion_id", "discount_rate"] }
    ],
    relationships: [
      { left: "PRODUCT", right: "PRODUCT_PROMOTION", leftMarker: "exactly-one", rightMarker: "zero-many" },
      { left: "PROMOTION", right: "PRODUCT_PROMOTION", leftMarker: "exactly-one", rightMarker: "zero-many" }
    ],
    keys: [
      { entity: "PRODUCT", attribute: "product_id", role: "PK" },
      { entity: "PROMOTION", attribute: "promotion_id", role: "PK" },
      { entity: "PRODUCT_PROMOTION", attribute: "product_id", role: "PK/FK" },
      { entity: "PRODUCT_PROMOTION", attribute: "promotion_id", role: "PK/FK" }
    ],
    explanation: "PRODUCT_PROMOTION is an associative entity. It resolves the many-to-many product-promotion relationship and stores discount_rate, which belongs to the pairing. Its two foreign keys form a composite primary key so one pairing cannot repeat."
  },
  {
    id: 6,
    difficulty: "Advanced",
    topic: "Travel itinerary",
    scenario: "A TRAVELER can make many RESERVATIONs. Each RESERVATION belongs to exactly one TRAVELER and exactly one FLIGHT. A FLIGHT may have zero or many RESERVATIONs. Each FLIGHT departs from exactly one AIRPORT, while an AIRPORT may serve zero or many FLIGHTs.",
    entities: [
      { name: "TRAVELER", attributes: ["traveler_id", "name"] },
      { name: "RESERVATION", attributes: ["reservation_id", "traveler_id", "flight_id", "seat"] },
      { name: "FLIGHT", attributes: ["flight_id", "depart_airport"] },
      { name: "AIRPORT", attributes: ["airport_code", "city"] }
    ],
    relationships: [
      { left: "TRAVELER", right: "RESERVATION", leftMarker: "exactly-one", rightMarker: "zero-many" },
      { left: "FLIGHT", right: "RESERVATION", leftMarker: "exactly-one", rightMarker: "zero-many" },
      { left: "AIRPORT", right: "FLIGHT", leftMarker: "zero-many", rightMarker: "exactly-one" }
    ],
    keys: [
      { entity: "TRAVELER", attribute: "traveler_id", role: "PK" },
      { entity: "RESERVATION", attribute: "reservation_id", role: "PK" },
      { entity: "RESERVATION", attribute: "traveler_id", role: "FK" },
      { entity: "RESERVATION", attribute: "flight_id", role: "FK" },
      { entity: "FLIGHT", attribute: "flight_id", role: "PK" },
      { entity: "FLIGHT", attribute: "depart_airport", role: "FK" },
      { entity: "AIRPORT", attribute: "airport_code", role: "PK" }
    ],
    explanation: "RESERVATION connects each traveler to one flight, while travelers and flights can each have many reservations. The AIRPORT relationship is one-to-many: each FLIGHT has exactly one departure AIRPORT, while an AIRPORT can serve zero or many FLIGHTs. FLIGHT.depart_airport is the foreign key."
  }
];
