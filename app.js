(() => {
  "use strict";

  const questionBanks = { read: erdQuestions, terminology: terminologyQuestions, blank: fillBlankQuestions, build: buildChallenges };
  const modeDetails = {
    read: { label: "READ AN ERD", title: "Relationship reconnaissance" },
    terminology: { label: "TERMINOLOGY", title: "Modeling language lab" },
    blank: { label: "FILL IN THE BLANK", title: "Complete the model" }
  };
  const state = { mode: "read", score: 0, streak: 0, answered: 0, answeredByMode: { read: 0, terminology: 0, blank: 0, build: 0 }, questionIndex: 0, selectedAnswer: null, answerChecked: false, builderIndex: 0, builderEntities: [], builderRelationships: [], builderDraftRelationship: null, builderAttempted: false, builderSelectedEntity: null, builderKeyStatus: {} };
  const elements = {
    dashboard: document.querySelector("#dashboard"), practice: document.querySelector("#practice"), builder: document.querySelector("#builder"), score: document.querySelector("#score-value"), streak: document.querySelector("#streak-value"), difficulty: document.querySelector("#difficulty-value"), progress: document.querySelector("#progress-value"), questionCounter: document.querySelector("#question-counter"), questionProgress: document.querySelector("#question-progress"), practiceModeLabel: document.querySelector("#practice-mode-label"), practiceHeading: document.querySelector("#practice-heading"), diagramCanvas: document.querySelector("#diagram-canvas"), diagramConnector: document.querySelector(".diagram-connector"), leftEntity: document.querySelector(".entity-left"), rightEntity: document.querySelector(".entity-right"), leftEndpoint: document.querySelector(".endpoint-left"), rightEndpoint: document.querySelector(".endpoint-right"), missingEntityPlaceholder: document.querySelector(".missing-entity-placeholder"), missingRelationshipPlaceholder: document.querySelector(".missing-relationship-placeholder"), conceptCard: document.querySelector("#concept-card"), diagramLegend: document.querySelector(".diagram-legend"), diagramNote: document.querySelector(".diagram-note"), topic: document.querySelector("#question-topic"), difficultyLabel: document.querySelector("#question-difficulty"), questionText: document.querySelector("#question-text"), answerList: document.querySelector("#answer-list"), feedback: document.querySelector("#feedback"), nextButton: document.querySelector("#next-button"), backButton: document.querySelector("#back-button"), builderBackButton: document.querySelector("#builder-back-button"), builderCounter: document.querySelector("#builder-counter"), builderProgress: document.querySelector("#builder-progress"), builderTopic: document.querySelector("#builder-topic"), builderChallengeTitle: document.querySelector("#builder-challenge-title"), builderScenario: document.querySelector("#builder-scenario"), entityBank: document.querySelector("#entity-bank"), builderWorkspace: document.querySelector("#builder-workspace"), builderSelectionStatus: document.querySelector("#builder-selection-status"), relationshipLeft: document.querySelector("#relationship-left"), relationshipRight: document.querySelector("#relationship-right"), createRelationshipButton: document.querySelector("#create-relationship-button"), relationshipEditor: document.querySelector("#relationship-editor"), relationshipEditorLabel: document.querySelector("#relationship-editor-label"), relationshipStatus: document.querySelector("#relationship-status"), leftEndLabel: document.querySelector("#left-end-label"), rightEndLabel: document.querySelector("#right-end-label"), leftMarkerSelect: document.querySelector("#left-marker-select"), rightMarkerSelect: document.querySelector("#right-marker-select"), saveRelationshipButton: document.querySelector("#save-relationship-button"), checkModelButton: document.querySelector("#check-model-button"), showSolutionButton: document.querySelector("#show-solution-button"), nextChallengeButton: document.querySelector("#next-challenge-button"), builderFeedback: document.querySelector("#builder-feedback")
  };

  function currentBank() { return questionBanks[state.mode]; }

  function updateDashboardStats() {
    const bank = currentBank();
    const currentQuestion = bank[Math.min(state.questionIndex, bank.length - 1)];
    elements.score.textContent = state.score;
    elements.streak.textContent = state.streak;
    elements.progress.textContent = `${Math.min(100, Math.round((state.answeredByMode[state.mode] / bank.length) * 100))}%`;
    elements.difficulty.textContent = currentQuestion ? currentQuestion.difficulty : "Complete";
  }

  function startPractice(mode) {
    if (mode === "build") {
      startBuilder();
      return;
    }
    state.mode = mode;
    state.questionIndex = 0;
    state.selectedAnswer = null;
    state.answerChecked = false;
    elements.dashboard.hidden = true;
    elements.practice.hidden = false;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderQuestion() {
    const question = currentBank()[state.questionIndex];
    const details = modeDetails[state.mode];
    state.selectedAnswer = null;
    state.answerChecked = false;
    elements.practiceModeLabel.textContent = details.label;
    elements.practiceHeading.textContent = details.title;
    elements.questionCounter.textContent = `Question ${state.questionIndex + 1} of ${currentBank().length}`;
    elements.questionProgress.style.width = `${((state.questionIndex + 1) / currentBank().length) * 100}%`;
    elements.topic.textContent = question.topic.toUpperCase();
    elements.difficultyLabel.textContent = question.difficulty.toUpperCase();
    elements.questionText.textContent = question.question;
    renderStudyPanel(question);
    elements.answerList.innerHTML = "";
    elements.feedback.hidden = true;
    elements.feedback.className = "feedback";
    elements.nextButton.disabled = true;
    elements.nextButton.innerHTML = "Check answer <span aria-hidden=\"true\">→</span>";
    question.choices.forEach((choice, index) => {
      const answerButton = document.createElement("button");
      answerButton.type = "button";
      answerButton.className = "answer-choice";
      answerButton.setAttribute("role", "radio");
      answerButton.setAttribute("aria-checked", "false");
      answerButton.dataset.answer = choice;
      answerButton.innerHTML = `<span class="choice-letter">${String.fromCharCode(65 + index)}</span><span>${choice}</span>`;
      answerButton.addEventListener("click", () => selectAnswer(answerButton, choice));
      elements.answerList.appendChild(answerButton);
    });
  }

  function renderStudyPanel(question) {
    const isTerminology = state.mode === "terminology";
    elements.diagramCanvas.hidden = isTerminology;
    elements.diagramLegend.hidden = isTerminology;
    elements.diagramNote.hidden = isTerminology;
    elements.conceptCard.hidden = !isTerminology;
    if (isTerminology) {
      elements.conceptCard.innerHTML = `<span class="concept-kicker">CONCEPT FOCUS</span><strong>${question.topic}</strong><p>Choose the definition or scenario that best matches the course model.</p>`;
      return;
    }
    renderDiagram(question.diagram, question.missing, question.missingKey, question.answer);
  }

  function startBuilder() {
    state.mode = "build";
    state.builderIndex = 0;
    state.builderAttempted = false;
    elements.dashboard.hidden = true;
    elements.practice.hidden = true;
    elements.builder.hidden = false;
    renderBuilderChallenge();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function currentChallenge() { return buildChallenges[state.builderIndex]; }

  function renderBuilderChallenge() {
    const challenge = currentChallenge();
    state.builderEntities = [];
    state.builderRelationships = [];
    state.builderDraftRelationship = null;
    state.builderKeyStatus = {};
    state.builderAttempted = false;
    elements.builderCounter.textContent = `Challenge ${state.builderIndex + 1} of ${buildChallenges.length}`;
    elements.builderProgress.style.width = `${((state.builderIndex + 1) / buildChallenges.length) * 100}%`;
    elements.builderTopic.textContent = `${challenge.difficulty.toUpperCase()} / ${String(challenge.id).padStart(2, "0")}`;
    elements.builderChallengeTitle.textContent = challenge.topic;
    elements.builderScenario.textContent = challenge.scenario;
    elements.builderFeedback.hidden = true;
    elements.showSolutionButton.hidden = true;
    elements.nextChallengeButton.hidden = true;
    elements.relationshipEditor.hidden = true;
    elements.checkModelButton.disabled = false;
    renderEntityBank();
    renderBuilderWorkspace();
    updateRelationshipSelects();
  }

  function renderEntityBank() {
    const challenge = currentChallenge();
    elements.entityBank.innerHTML = "";
    challenge.entities.forEach((entity) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "entity-bank-item";
      button.textContent = state.builderEntities.some((item) => item.name === entity.name) ? `${entity.name} added` : entity.name;
      button.disabled = state.builderEntities.some((item) => item.name === entity.name);
      button.addEventListener("click", () => addBuilderEntity(entity));
      elements.entityBank.appendChild(button);
    });
  }

  function addBuilderEntity(entity) {
    if (state.builderEntities.some((item) => item.name === entity.name)) return;
    state.builderEntities.push({ name: entity.name, attributes: entity.attributes.map((name) => ({ name, role: "" })) });
    renderEntityBank();
    renderBuilderWorkspace();
    updateRelationshipSelects();
  }

  function renderBuilderWorkspace() {
    elements.builderWorkspace.innerHTML = "";
    const canvas = document.createElement("div");
    canvas.className = "builder-canvas";
    const relationshipSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    relationshipSvg.classList.add("builder-relationship-svg");
    relationshipSvg.setAttribute("aria-hidden", "true");
    canvas.appendChild(relationshipSvg);
    if (!state.builderEntities.length) {
      canvas.insertAdjacentHTML("beforeend", '<div class="workspace-empty"><strong>Your model starts here</strong><span>Add an entity from the bank to begin.</span></div>');
    } else {
      const entityGrid = document.createElement("div");
      entityGrid.className = "builder-entity-grid";
      state.builderEntities.forEach((entity) => entityGrid.appendChild(renderBuilderEntity(entity)));
      canvas.appendChild(entityGrid);
    }
    elements.builderWorkspace.appendChild(canvas);
    if (state.builderRelationships.length) {
      const relationshipList = document.createElement("div");
      relationshipList.className = "builder-relationship-list";
      state.builderRelationships.forEach((relationship, index) => {
        const item = document.createElement("div");
        item.className = "builder-relationship-card";
        item.className = `builder-relationship-card ${relationship.status === "editing" ? "editing" : "saved"}`;
        item.innerHTML = `<strong>${relationship.left} <span>—</span> ${relationship.right}</strong><span class="builder-endpoint-label"><i class="builder-marker">${renderMarker(relationship.leftMarker)}</i><i class="builder-line"></i><i class="builder-marker">${renderMarker(relationship.rightMarker)}</i></span><button type="button" aria-label="Remove relationship">×</button>`;
        item.querySelector("button").addEventListener("click", () => { state.builderRelationships.splice(index, 1); renderBuilderWorkspace(); });
        relationshipList.appendChild(item);
      });
      elements.builderWorkspace.appendChild(relationshipList);
    }
    requestAnimationFrame(() => drawBuilderRelationships(canvas, relationshipSvg));
    elements.builderSelectionStatus.textContent = state.builderSelectedEntity ? `${state.builderSelectedEntity} selected` : "Select an entity";
  }

  function drawBuilderRelationships(canvas, svg) {
    svg.innerHTML = "";
    const relationships = state.builderRelationships.map((relationship) => ({ ...relationship, status: "saved" }));
    if (state.builderDraftRelationship) relationships.push({ ...state.builderDraftRelationship, status: "editing" });
    relationships.forEach((relationship) => {
      const leftCard = [...canvas.querySelectorAll(".builder-entity-card")].find((card) => card.dataset.entity === relationship.left);
      const rightCard = [...canvas.querySelectorAll(".builder-entity-card")].find((card) => card.dataset.entity === relationship.right);
      if (!leftCard || !rightCard) return;
      const points = getBuilderEndpoints(leftCard, rightCard, canvas);
      const left = points.left;
      const right = points.right;
      const length = Math.hypot(right.x - left.x, right.y - left.y);
      const direction = { x: (right.x - left.x) / length, y: (right.y - left.y) / length };
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.classList.add(`builder-relationship-${relationship.status}`);
      group.appendChild(svgLine(left.x, left.y, right.x, right.y));
      group.appendChild(svgMarker(left.x - direction.x * 8, left.y - direction.y * 8, right.x - left.x, right.y - left.y, relationship.leftMarker));
      group.appendChild(svgMarker(right.x + direction.x * 8, right.y + direction.y * 8, left.x - right.x, left.y - right.y, relationship.rightMarker));
      svg.appendChild(group);
    });
  }

  function getBuilderEndpoints(leftCard, rightCard, canvas) {
    const leftRect = leftCard.getBoundingClientRect();
    const rightRect = rightCard.getBoundingClientRect();
    const canvasRect = canvas.getBoundingClientRect();
    const leftCenter = { x: leftRect.left + leftRect.width / 2, y: leftRect.top + leftRect.height / 2 };
    const rightCenter = { x: rightRect.left + rightRect.width / 2, y: rightRect.top + rightRect.height / 2 };
    const leftPoint = builderBoundaryPoint(leftRect, rightCenter.x, rightCenter.y);
    const rightPoint = builderBoundaryPoint(rightRect, leftCenter.x, leftCenter.y);
    return {
      left: { x: leftPoint.x - canvasRect.left, y: leftPoint.y - canvasRect.top },
      right: { x: rightPoint.x - canvasRect.left, y: rightPoint.y - canvasRect.top }
    };
  }

  function builderBoundaryPoint(rectangle, targetX, targetY) {
    const centerX = rectangle.left + rectangle.width / 2;
    const centerY = rectangle.top + rectangle.height / 2;
    const deltaX = targetX - centerX;
    const deltaY = targetY - centerY;
    const horizontalScale = deltaX === 0 ? Infinity : rectangle.width / 2 / Math.abs(deltaX);
    const verticalScale = deltaY === 0 ? Infinity : rectangle.height / 2 / Math.abs(deltaY);
    const scale = Math.min(horizontalScale, verticalScale);
    return { x: centerX + deltaX * scale, y: centerY + deltaY * scale };
  }

  function svgLine(x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1); line.setAttribute("y1", y1); line.setAttribute("x2", x2); line.setAttribute("y2", y2); line.classList.add("builder-line-shape");
    return line;
  }

  function svgMarker(x, y, dx, dy, marker) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;
    group.setAttribute("transform", `translate(${x} ${y}) rotate(${angle})`);
    group.classList.add("builder-svg-marker");
    if (marker.startsWith("zero")) {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", "0"); circle.setAttribute("cy", "0"); circle.setAttribute("r", "6"); group.appendChild(circle);
    } else {
      group.appendChild(svgBar(0));
    }
    if (marker.endsWith("many")) {
      [-8, 0, 8].forEach((offset) => group.appendChild(svgFoot(offset)));
    } else {
      group.appendChild(svgBar(13));
    }
    return group;
  }

  function svgBar(x) {
    const bar = document.createElementNS("http://www.w3.org/2000/svg", "line");
    bar.setAttribute("x1", x); bar.setAttribute("y1", "-10"); bar.setAttribute("x2", x); bar.setAttribute("y2", "10"); return bar;
  }

  function svgFoot(offset) {
    const foot = document.createElementNS("http://www.w3.org/2000/svg", "line");
    foot.setAttribute("x1", "16"); foot.setAttribute("y1", offset - 7); foot.setAttribute("x2", "0"); foot.setAttribute("y2", offset); return foot;
  }

  function renderBuilderEntity(entity) {
    const card = document.createElement("article");
    card.className = `builder-entity-card ${state.builderSelectedEntity === entity.name ? "selected" : ""}`;
    card.dataset.entity = entity.name;
    card.innerHTML = `<button class="builder-entity-title" type="button">${entity.name}<span>select</span></button><div class="builder-attributes"></div>`;
    card.querySelector(".builder-entity-title").addEventListener("click", () => { state.builderSelectedEntity = entity.name; renderBuilderWorkspace(); });
    const attributes = card.querySelector(".builder-attributes");
    entity.attributes.forEach((attribute) => {
      const row = document.createElement("div");
      row.className = "builder-attribute";
      const pkStatus = state.builderKeyStatus[`${entity.name}.${attribute.name}.PK`] || "";
      const fkStatus = state.builderKeyStatus[`${entity.name}.${attribute.name}.FK`] || "";
      row.innerHTML = `<span>${attribute.name}</span><button type="button" class="role-button ${attribute.role === "PK" || attribute.role === "PK/FK" ? "active" : ""} ${pkStatus}">${attribute.role === "PK" || attribute.role === "PK/FK" ? "✓ " : ""}PK</button><button type="button" class="role-button ${attribute.role === "FK" || attribute.role === "PK/FK" ? "active" : ""} ${fkStatus}">${attribute.role === "FK" || attribute.role === "PK/FK" ? "✓ " : ""}FK</button>`;
      row.querySelectorAll(".role-button").forEach((button) => button.addEventListener("click", () => toggleAttributeRole(entity.name, attribute.name, button.textContent)));
      attributes.appendChild(row);
    });
    return card;
  }

  function toggleAttributeRole(entityName, attributeName, role) {
    const entity = state.builderEntities.find((item) => item.name === entityName);
    const attribute = entity.attributes.find((item) => item.name === attributeName);
    const hasRole = attribute.role === role || attribute.role === "PK/FK";
    if (role === "PK") attribute.role = hasRole ? "" : attribute.role === "FK" ? "PK/FK" : "PK";
    if (role === "FK") attribute.role = hasRole ? "" : attribute.role === "PK" ? "PK/FK" : "FK";
    renderBuilderWorkspace();
  }

  function updateRelationshipSelects() {
    [elements.relationshipLeft, elements.relationshipRight].forEach((select) => {
      const selected = select.value;
      select.innerHTML = '<option value="">Choose entity</option>';
      state.builderEntities.forEach((entity) => { select.insertAdjacentHTML("beforeend", `<option value="${entity.name}">${entity.name}</option>`); });
      select.value = selected;
    });
  }

  function openRelationshipEditor() {
    const left = elements.relationshipLeft.value;
    const right = elements.relationshipRight.value;
    if (!left || !right || left === right) return;
    elements.relationshipEditor.hidden = false;
    elements.relationshipEditorLabel.textContent = `${left} — ${right}`;
    state.builderDraftRelationship = { left, right, leftMarker: elements.leftMarkerSelect.value, rightMarker: elements.rightMarkerSelect.value };
    setRelationshipStatus("Unsaved relationship changes", true);
    updateEndpointPrompts(left, right);
    renderBuilderWorkspace();
  }

  function updateEndpointPrompts(left, right) {
    elements.leftEndLabel.textContent = `For each ${right}, how many ${left} can/must there be?`;
    elements.rightEndLabel.textContent = `For each ${left}, how many ${right} can/must there be?`;
  }

  function saveRelationship() {
    const left = elements.relationshipLeft.value;
    const right = elements.relationshipRight.value;
    if (!left || !right || left === right) return;
    const existing = state.builderRelationships.find((relationship) => relationship.left === left && relationship.right === right);
    const relationship = { left, right, leftMarker: elements.leftMarkerSelect.value, rightMarker: elements.rightMarkerSelect.value };
    if (existing) Object.assign(existing, relationship);
    else state.builderRelationships.push(relationship);
    elements.relationshipEditor.hidden = false;
    state.builderDraftRelationship = null;
    setRelationshipStatus("Relationship saved ✓", false);
    renderBuilderWorkspace();
  }

  function updateDraftRelationship() {
    if (!state.builderDraftRelationship) return;
    state.builderDraftRelationship.leftMarker = elements.leftMarkerSelect.value;
    state.builderDraftRelationship.rightMarker = elements.rightMarkerSelect.value;
    setRelationshipStatus("Unsaved relationship changes", true);
    renderBuilderWorkspace();
  }

  function setRelationshipStatus(message, unsaved) {
    elements.relationshipStatus.textContent = message;
    elements.relationshipStatus.className = `relationship-status ${unsaved ? "unsaved" : "saved"}`;
    elements.saveRelationshipButton.classList.toggle("save-pending", unsaved);
  }

  function checkBuilderModel() {
    const challenge = currentChallenge();
    const expectedNames = challenge.entities.map((entity) => entity.name);
    const chosenNames = state.builderEntities.map((entity) => entity.name);
    const correctEntities = expectedNames.filter((name) => chosenNames.includes(name)).length;
    const extraEntities = chosenNames.filter((name) => !expectedNames.includes(name)).length;
    const correctRelationships = challenge.relationships.filter((expected) => state.builderRelationships.some((actual) => relationshipConnects(actual, expected))).length;
    const correctCardinalities = challenge.relationships.filter((expected) => state.builderRelationships.some((actual) => relationshipMatches(actual, expected))).length;
    const correctKeys = challenge.keys.filter((expected) => state.builderEntities.some((entity) => entity.name === expected.entity && entity.attributes.some((attribute) => attribute.name === expected.attribute && attribute.role === expected.role))).length;
    const entityScore = Math.max(0, (correctEntities - extraEntities) / expectedNames.length) * 20;
    const relationshipScore = challenge.relationships.length ? (correctRelationships / challenge.relationships.length) * 25 : 25;
    const cardinalityScore = challenge.relationships.length ? (correctCardinalities / challenge.relationships.length) * 30 : 30;
    const keyScore = challenge.keys.length ? (correctKeys / challenge.keys.length) * 15 : 15;
    const complete = correctEntities === expectedNames.length && extraEntities === 0 && correctRelationships === challenge.relationships.length && correctCardinalities === challenge.relationships.length && correctKeys === challenge.keys.length;
    const total = Math.round(entityScore + relationshipScore + cardinalityScore + keyScore + (complete ? 10 : 0));
    const messages = [];
    const entityDetails = expectedNames.map((name) => `${name}: ${chosenNames.includes(name) ? "correct" : "missing"}`).concat(chosenNames.filter((name) => !expectedNames.includes(name)).map((name) => `${name}: unnecessary`));
    messages.push(`Entities — ${correctEntities}/${expectedNames.length} correct.`, ...entityDetails);
    const relationshipDetails = challenge.relationships.map((expected) => {
      const actual = state.builderRelationships.find((candidate) => candidate.left === expected.left && candidate.right === expected.right || candidate.left === expected.right && candidate.right === expected.left);
      if (!actual) return `Missing ${expected.left} → ${expected.right} relationship.`;
      if (!relationshipMatches(actual, expected)) return `${expected.left} → ${expected.right} relationship exists, but its endpoint cardinality/optionality is incorrect.`;
      return `${expected.left} → ${expected.right} relationship is correct.`;
    });
    messages.push(`Relationships — ${correctRelationships}/${challenge.relationships.length} correct.`, ...relationshipDetails);
    messages.push(`Cardinality/optionality — ${correctCardinalities}/${challenge.relationships.length} relationship ends correct.`, correctCardinalities === challenge.relationships.length ? "Both ends use the required Crow's Foot markers." : "Review both endpoint selectors against the business rule.");
    state.builderKeyStatus = {};
    const keyDetails = challenge.keys.map((expected) => {
      const actualEntity = state.builderEntities.find((entity) => entity.name === expected.entity);
      const actual = actualEntity?.attributes.find((attribute) => attribute.name === expected.attribute);
      const statusKey = `${expected.entity}.${expected.attribute}.${expected.role.includes("PK") ? "PK" : "FK"}`;
      if (!actual || !actual.role) { state.builderKeyStatus[statusKey] = "key-error"; return `${expected.entity}.${expected.attribute}: missing ${expected.role}.`; }
      if (actual.role === expected.role) { state.builderKeyStatus[statusKey] = "key-success"; return `${expected.entity}.${expected.attribute}: correct ${expected.role}.`; }
      state.builderKeyStatus[statusKey] = "key-error";
      return `${expected.entity}.${expected.attribute}: expected ${expected.role}, found ${actual.role}.`;
    });
    messages.push(`Keys — ${correctKeys}/${challenge.keys.length} correct.`, ...keyDetails);
    messages.push(complete ? `Complete business-rule model: ${challenge.explanation}` : "Keep iterating, then check the model again. Your score reflects the parts already correct.");
    state.builderAttempted = true;
    state.answered += 1;
    state.answeredByMode.build += 1;
    state.score += total;
    state.streak = total >= 70 ? state.streak + 1 : 0;
    elements.builderFeedback.hidden = false;
    elements.builderFeedback.className = `builder-feedback ${complete ? "builder-success" : "builder-review"}`;
    elements.builderFeedback.innerHTML = `<strong>${complete ? "Model accepted" : `Model score: ${total}%`}</strong><ul>${messages.map((message) => `<li>${message}</li>`).join("")}</ul>`;
    renderBuilderWorkspace();
    elements.showSolutionButton.hidden = false;
    if (complete && state.builderIndex < buildChallenges.length - 1) elements.nextChallengeButton.hidden = false;
    updateDashboardStats();
  }

  function relationshipMatches(actual, expected) {
    return (actual.left === expected.left && actual.right === expected.right && actual.leftMarker === expected.leftMarker && actual.rightMarker === expected.rightMarker) || (actual.left === expected.right && actual.right === expected.left && actual.leftMarker === expected.rightMarker && actual.rightMarker === expected.leftMarker);
  }

  function relationshipConnects(actual, expected) {
    return (actual.left === expected.left && actual.right === expected.right) || (actual.left === expected.right && actual.right === expected.left);
  }

  function showBuilderSolution() {
    const challenge = currentChallenge();
    state.builderKeyStatus = {};
    state.builderEntities = challenge.entities.map((entity) => ({ name: entity.name, attributes: entity.attributes.map((name) => ({ name, role: challenge.keys.find((key) => key.entity === entity.name && key.attribute === name)?.role || "" })) }));
    state.builderRelationships = challenge.relationships.map((relationship) => ({ ...relationship }));
    renderEntityBank();
    renderBuilderWorkspace();
    updateRelationshipSelects();
    elements.builderFeedback.hidden = false;
    elements.builderFeedback.className = "builder-feedback builder-success";
    elements.builderFeedback.innerHTML = `<strong>Solution shown</strong><p>${challenge.explanation}</p>`;
    elements.nextChallengeButton.hidden = state.builderIndex >= buildChallenges.length - 1;
  }

  function nextBuilderChallenge() {
    if (state.builderIndex >= buildChallenges.length - 1) returnToDashboard();
    else { state.builderIndex += 1; renderBuilderChallenge(); }
  }

  function renderDiagram(diagram, missing, missingKey, answer) {
    const isBlank = state.mode === "blank";
    const revealMissing = !isBlank || state.answerChecked;
    const leftKeyTarget = missing === "left-key" || missing === "composite-key";
    const rightKeyTarget = missing === "right-key" || missing === "foreign-key" || missing === "composite-key";
    const leftKeyMissing = leftKeyTarget && !revealMissing;
    const rightKeyMissing = rightKeyTarget && !revealMissing;
    elements.leftEntity.innerHTML = renderEntity(diagram.leftEntity, leftKeyTarget ? missingKey || true : false, revealMissing);
    elements.rightEntity.innerHTML = renderEntity(diagram.rightEntity, rightKeyTarget ? missingKey || true : false, revealMissing);
    elements.leftEntity.classList.toggle("missing-part", leftKeyMissing);
    elements.rightEntity.classList.toggle("missing-part", rightKeyMissing);
    const leftMarkerMissing = isBlank && !revealMissing && ["left-marker", "relationship-type", "relationship"].includes(missing);
    const rightMarkerMissing = isBlank && !revealMissing && ["right-marker", "relationship-type", "relationship"].includes(missing);
    elements.leftEndpoint.className = `relationship-end endpoint-left ${diagram.leftEntity.marker} ${leftMarkerMissing ? "missing-part" : revealMissing && missing === "left-marker" ? "revealed-answer" : ""}`;
    elements.rightEndpoint.className = `relationship-end endpoint-right ${diagram.rightEntity.marker} ${rightMarkerMissing ? "missing-part" : revealMissing && missing === "right-marker" ? "revealed-answer" : ""}`;
    elements.leftEndpoint.innerHTML = leftMarkerMissing ? renderMissingMarker() : renderMarker(diagram.leftEntity.marker);
    elements.rightEndpoint.innerHTML = rightMarkerMissing ? renderMissingMarker() : renderMarker(diagram.rightEntity.marker);
    const entityMissing = isBlank && missing === "entity";
    elements.missingEntityPlaceholder.hidden = !entityMissing;
    elements.missingEntityPlaceholder.textContent = entityMissing && !revealMissing ? "?" : entityMissing ? answer : "";
    elements.missingEntityPlaceholder.classList.toggle("revealed-answer", entityMissing && revealMissing);
    const relationshipMissing = isBlank && ["relationship-type", "relationship", "business-rule"].includes(missing);
    elements.missingRelationshipPlaceholder.hidden = !relationshipMissing;
    elements.missingRelationshipPlaceholder.textContent = relationshipMissing && !revealMissing ? "?" : relationshipMissing ? answer : "";
    elements.missingRelationshipPlaceholder.classList.toggle("revealed-answer", relationshipMissing && revealMissing);
    elements.diagramCanvas.classList.toggle("missing-relationship", ["relationship-type", "relationship", "business-rule", "entity", "composite-key"].includes(missing));
    elements.diagramCanvas.setAttribute("aria-label", `${diagram.leftEntity.name} related to ${diagram.rightEntity.name} using Crow's Foot notation`);
    requestAnimationFrame(positionRelationship);
  }

  function renderMissingMarker() {
    return '<span class="missing-marker">?</span>';
  }

  function renderMarker(marker) {
    const minimum = marker.startsWith("zero") ? '<span class="marker-circle"></span>' : '<span class="marker-bar"></span>';
    const maximum = marker.endsWith("many") ? '<span class="marker-foot"><i></i><i></i><i></i></span>' : '<span class="marker-bar"></span>';
    return `${minimum}${maximum}`;
  }

  function renderEntity(entity, highlightKey, revealMissing) {
    const attributes = entity.attributes.map((attribute) => {
      const keyTarget = highlightKey && attribute.key && (highlightKey === true || highlightKey === attribute.name);
      const className = keyTarget ? (revealMissing ? "revealed-attribute" : "missing-attribute") : "";
      return `<span class="${className}"><b>${keyTarget && !revealMissing ? "?" : attribute.key || ""}</b> ${attribute.name}</span>`;
    }).join("");
    return `<strong>${entity.name}</strong>${attributes}`;
  }

  function positionRelationship() {
    if (elements.diagramCanvas.hidden) return;
    const canvasRect = elements.diagramCanvas.getBoundingClientRect();
    const scaleX = canvasRect.width / elements.diagramCanvas.offsetWidth;
    const scaleY = canvasRect.height / elements.diagramCanvas.offsetHeight;
    const leftRect = elements.leftEntity.getBoundingClientRect();
    const rightRect = elements.rightEntity.getBoundingClientRect();
    const leftCenter = { x: leftRect.left + leftRect.width / 2, y: leftRect.top + leftRect.height / 2 };
    const rightCenter = { x: rightRect.left + rightRect.width / 2, y: rightRect.top + rightRect.height / 2 };
    const startPoint = rectangleBoundaryPoint(leftRect, rightCenter.x, rightCenter.y);
    const endPoint = rectangleBoundaryPoint(rightRect, leftCenter.x, leftCenter.y);
    const start = { x: (startPoint.x - canvasRect.left) / scaleX, y: (startPoint.y - canvasRect.top) / scaleY };
    const end = { x: (endPoint.x - canvasRect.left) / scaleX, y: (endPoint.y - canvasRect.top) / scaleY };
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const length = Math.hypot(deltaX, deltaY);
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    const direction = { x: deltaX / length, y: deltaY / length };
    const markerGap = 23;
    elements.diagramConnector.style.left = `${start.x}px`;
    elements.diagramConnector.style.top = `${start.y}px`;
    elements.diagramConnector.style.width = `${length}px`;
    elements.diagramConnector.style.transform = `rotate(${angle}deg)`;
    positionMarker(elements.leftEndpoint, start.x + direction.x * markerGap, start.y + direction.y * markerGap, angle);
    positionMarker(elements.rightEndpoint, end.x - direction.x * markerGap, end.y - direction.y * markerGap, angle + 180);
  }

  function rectangleBoundaryPoint(rectangle, targetX, targetY) {
    const centerX = rectangle.left + rectangle.width / 2;
    const centerY = rectangle.top + rectangle.height / 2;
    const deltaX = targetX - centerX;
    const deltaY = targetY - centerY;
    const horizontalScale = deltaX === 0 ? Infinity : rectangle.width / 2 / Math.abs(deltaX);
    const verticalScale = deltaY === 0 ? Infinity : rectangle.height / 2 / Math.abs(deltaY);
    const scale = Math.min(horizontalScale, verticalScale);
    return { x: centerX + deltaX * scale, y: centerY + deltaY * scale };
  }

  function positionMarker(marker, x, y, angle) {
    marker.style.left = `${x}px`;
    marker.style.top = `${y}px`;
    marker.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
  }

  function selectAnswer(button, answer) {
    if (state.answerChecked) return;
    state.selectedAnswer = answer;
    document.querySelectorAll(".answer-choice").forEach((choiceButton) => {
      const selected = choiceButton === button;
      choiceButton.classList.toggle("selected", selected);
      choiceButton.setAttribute("aria-checked", String(selected));
    });
    elements.nextButton.disabled = false;
  }

  function checkAnswer() {
    const question = currentBank()[state.questionIndex];
    if (!state.selectedAnswer) return;
    if (!state.answerChecked) {
      const isCorrect = state.selectedAnswer === question.answer;
      state.answerChecked = true;
      state.answered += 1;
      state.answeredByMode[state.mode] += 1;
      state.score += isCorrect ? 10 : 0;
      state.streak = isCorrect ? state.streak + 1 : 0;
      document.querySelectorAll(".answer-choice").forEach((button) => {
        button.disabled = true;
        if (button.dataset.answer === question.answer) button.classList.add("correct");
        if (button.dataset.answer === state.selectedAnswer && !isCorrect) button.classList.add("incorrect");
      });
      showFeedback(isCorrect, question);
      renderStudyPanel(question);
      updateDashboardStats();
      elements.nextButton.innerHTML = state.questionIndex === currentBank().length - 1 ? "See results <span aria-hidden=\"true\">→</span>" : "Next question <span aria-hidden=\"true\">→</span>";
      return;
    }
    if (state.questionIndex < currentBank().length - 1) {
      state.questionIndex += 1;
      renderQuestion();
    } else {
      returnToDashboard();
    }
  }

  function showFeedback(isCorrect, question) {
    elements.feedback.hidden = false;
    elements.feedback.classList.add(isCorrect ? "feedback-correct" : "feedback-incorrect");
    elements.feedback.innerHTML = `<strong>${isCorrect ? "Correct read." : "Not quite."}</strong><p>${question.explanation}</p>`;
  }

  function returnToDashboard() {
    elements.practice.hidden = true;
    elements.builder.hidden = true;
    elements.dashboard.hidden = false;
    updateDashboardStats();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  document.querySelectorAll(".mode-card").forEach((modeCard) => {
    modeCard.addEventListener("click", () => {
      if (questionBanks[modeCard.dataset.mode]) startPractice(modeCard.dataset.mode);
    });
  });
  elements.nextButton.addEventListener("click", checkAnswer);
  elements.backButton.addEventListener("click", returnToDashboard);
  elements.builderBackButton.addEventListener("click", returnToDashboard);
  elements.createRelationshipButton.addEventListener("click", openRelationshipEditor);
  elements.saveRelationshipButton.addEventListener("click", saveRelationship);
  elements.leftMarkerSelect.addEventListener("change", updateDraftRelationship);
  elements.rightMarkerSelect.addEventListener("change", updateDraftRelationship);
  elements.checkModelButton.addEventListener("click", checkBuilderModel);
  elements.showSolutionButton.addEventListener("click", showBuilderSolution);
  elements.nextChallengeButton.addEventListener("click", nextBuilderChallenge);
  window.addEventListener("resize", positionRelationship);
  updateDashboardStats();
})();
