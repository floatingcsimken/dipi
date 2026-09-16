# Threat Intelligence Decision Support Platform 
Egy modern, tudásgráf-alapú incidenskezelési döntéstámogató platform, amely a **MITRE ATT&CK** vázat, a determinisztikus lefedettségszámítást és a **GraphRAG**-alapú mesterséges intelligenciát ötvözi. A rendszer célja a biztonsági elemzők munkájának támogatása strukturálatlan incidensleírások és logok feldolgozásában, a támadási lánc feltárásában és a leghatékonyabb védelmi intézkedések priorizálásában.

---

## Főbb képességek

* **Természetes nyelvű incidensbevitel:** Nyers logok, riasztások és eseményleírások közvetlen feldolgozása AI ágens segítségével (nincs szükség manuális technika-kiválasztásra).
* **Tudásgráf-alapú modellezés (Neo4j):** MITRE Enterprise ATT&CK relációk (technikák, altechnikák, elkövetői csoportok, eszközök és mitigációk) gráfalapú tárolása és több lépéses bejárása.
* **Determinisztikus lefedettségi pontszám (`CoverageScore`):** Matematikailag igazolható metrika a beazonosított technikákat lefedő mitigációk objektív rangsorolására.
* **GraphRAG & Támadói profilozás:** Strukturált gráftények és szemantikus keresés ötvözése a kontextusablak gazdagítására (Graph Grounding), az ismert támadócsoportok (`IntrusionSet`) mintázatainak figyelembevételével.
* **Támadási folyamat vizualizáció (Attack Flow):** Interaktív vizuális folyamatábra és idővonal az incidens fázisainak bemutatására:
  * **Honnan jött a támadó?** (Gyökérok, feltételezett korábbi sérülékenység)
  * **Hol tartunk most?** (Azonosított technikák és priorizált mitigációk a `coverageScore` alapján)
  * **Hova léphet tovább?** (Prediktív becslés a Cyber Kill Chain és ismert viselkedésminták alapján)

---

## Architektúra áttekintés

```text
[ Felhasználói bemenet (Prompt / Nyers logok) ]
                      │
                      ▼
             [ AI Agent Service ]
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
 [ GraphRAG Engine ]       [ RetrievalService ]
 (Szemantikus keresés       (Cypher lekérdezések
  & Támadói profilozás)      a MITRE gráfból)
        │                           │
        │                           ▼
        │                [ CoverageScoreService ]
        │                (Determinisztikus pontozás)
        └─────────────┬─────────────┘
                      ▼
         [ Strukturált JSON válasz ]
                      │
                      ▼
     [ Frontend: Interaktív Attack Flow UI ]
