# KenDji Luxury — Architecture d'Intégration Transporteurs (Algérie)

Ce document décrit l'abstraction transporteur et la stratégie de livraison neutre et extensible de KenDji Luxury.

---

## 1. Principe de Neutralité Transporteur

Le domaine métier des Commandes et des Livraisons ne dépend directement d'aucun transporteur spécifique. Toute communication transite par l'interface `CourierProvider` :

```typescript
export interface CourierProvider {
  readonly name: string;
  readonly code: string;
  readonly isSandbox: boolean;

  createShipment(request: ShipmentCreationRequest): Promise<ShipmentCreationResult>;
  getShipmentStatus(trackingNumber: string): Promise<NormalizedShipmentStatusResult>;
  cancelShipment(trackingNumber: string, reason?: string): Promise<{ success: boolean; error?: string }>;
  getTrackingUrl(trackingNumber: string): string | null;
}
```

---

## 2. Adaptateurs Disponibles

| Adaptateur | Code | Statut de Configuration | Environnement |
| :--- | :--- | :--- | :--- |
| **KenDji Sandbox Adapter** | `MOCK` | Actif par défaut | Local / Test / Sandbox |
| **Yalidine Express Adapter** | `YALIDINE` | Prêt pour clés API (`YALIDINE_API_KEY`, `YALIDINE_API_TOKEN`) | Production |
| **ZR Express Adapter** | `ZR_EXPRESS` | Prêt pour clés API (`ZR_EXPRESS_API_KEY`, `ZR_EXPRESS_TOKEN`) | Production |

---

## 3. Normalisation des Statuts Transporteur

Chaque transporteur tiers utilise sa propre nomenclature. Les adaptateurs traduisent systématiquement ces états vers le modèle unifié KenDji :

| Statut Transporteur Exemple | Statut Normalisé KenDji (`DeliveryStatus`) |
| :--- | :--- |
| *Nouveau colis / Créé* | `CREATED` |
| *En transit / Centre de tri / Expédié* | `IN_TRANSIT` |
| *En distribution / Livreur en route* | `OUT_FOR_DELIVERY` |
| *Livré au client / Reçu* | `DELIVERED` |
| *Échec / Destinataire absent* | `FAILED` |
| *Retour vers expéditeur / Refus* | `RETURNED` |
| *Annulé* | `CANCELLED` |

---

## 4. Sécurité des Identifiants

Les clés et tokens des transporteurs ne sont **jamais** exposés côté client ou dans les réponses JSON publiques. Toutes les requêtes sont exécutées via des Server Actions protégées (`createShipmentAction`).
