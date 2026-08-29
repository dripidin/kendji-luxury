# KenDji Luxury — Guide des Opérations Commerciales & COD

Ce document détaille le cycle opérationnel des commandes, la gestion des stocks, la traçabilité des livraisons et le rapprochement financier (Cash on Delivery) pour la boutique KenDji Luxury.

---

## 1. Cycle de Vie des Commandes (Machine à États)

Toute commande suit un cycle strict et unidirectionnel :

```text
[NOUVELLE COMMANDE] (PENDING)
         │
         ├──> [ANNULÉE] (CANCELLED)
         ▼
    [CONFIRMÉE] (CONFIRMED) ── (Validation téléphonique de l'adresse et disponibilité)
         │
         ├──> [ANNULÉE] (CANCELLED)
         ▼
  [EN PRÉPARATION] (PREPARING) ── (Inspection joaillerie & écrin luxe)
         │
         ├──> [ANNULÉE] (CANCELLED)
         ▼
 [PRÊTE À EXPÉDIER] (READY_TO_SHIP) ── (Bordereau transporteur généré)
         │
         ├──> [ANNULÉE] (CANCELLED)
         ▼
    [EXPÉDIÉE] (SHIPPED) ── (Prise en charge par le transporteur express)
         │
         ├──> [LIVRÉE] (DELIVERED) ── (Remise au client & encaissement espèces)
         │
         └──> [RETOURNÉE] (RETURNED) ── (Refus client ou adresse introuvable)
```

### Règles d'or :
1. **Transitions Validées :** Les sauts d'états incohérents (ex: `LIVRÉE` vers `EN ATTENTE`) sont rejetés côté serveur.
2. **Journal d'Audit Automatique :** Tout changement d'état génère un événement horodaté dans la table `order_timeline_events` avec l'identifiant de l'opérateur et d'éventuelles notes de suivi.

---

## 2. Rapprochement Financier Cash on Delivery (COD)

En Algérie, le paiement en espèces lors de la livraison exige une séparation claire entre le statut de livraison et le statut financier :

| Statut Financier | Définition |
| :--- | :--- |
| **`UNPAID`** | Commande en cours, fonds non encore encaissés. |
| **`COLLECTED`** | Espèces perçues par le livreur sur le terrain. |
| **`RECONCILED`** | Fonds effectivement reversés sur le compte bancaire de la boutique. |
| **`DISCREPANCY`** | Écart constaté entre le montant attendu et le montant perçu. |

---

## 3. Gestion Légère des Stocks

Pour le catalogue de 25 bijoux de haute joaillerie :
- Chaque produit et variante possède un niveau de stock configurable (`stock_quantity`) et un statut (`IN_STOCK`, `OUT_OF_STOCK`, `UNTRACKED`).
- Seuil d'alerte de stock faible : ≤ 3 unités.
- Ajustement instantané via l'interface `/admin/inventory`.
