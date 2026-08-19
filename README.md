# Threat Intelligence Decision Support Platform (OODA)

Egy gráfalapú kiberbiztonsági döntéstámogató rendszer, amely a **STIX 2.1** szabványt, a **MITRE ATT&CK** keretrendszert és az **OODA (Observe–Orient–Decide–Act)** döntési ciklust integrálja incidensek attribúciójára és mitigációjára.

---

## 🏗️ Architektúra és Rendszerterv

A rendszer három fő rétegből áll:

1. **Neo4j Gráf Adatbázis:** STIX 2.1 fenyegetettségi entitások (`ThreatActor`, `Identity`, `Malware`, `AttackPattern`, `CourseOfAction`) és kapcsolataik tárolása.
2. **Backend (Node.js & Express + TypeScript):**
   * Rétegzett architektúra: `Controllers` ➔ `Services` ➔ `Repositories`.
   * Hasonlósági pontozó algoritmus (Similarity Scoring) a támadói profilok rangsorolására.
   * Predikciós motor és mitigációs ajánlórendszer.
3. **Frontend (React + Vite + Tailwind CSS):**
   * SOC-fókuszú, sötét témájú OODA irányítópult.
   * Incidens-bemeneti űrlap és dinamikus attribúciós vizualizáció.

---
