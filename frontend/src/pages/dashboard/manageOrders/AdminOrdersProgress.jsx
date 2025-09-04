// AdminOrdersProgress.jsx
// -----------------------------------------------------------------------------
// Purpose: Admin page to track per-item production progress for each order.
// Features:
//   - Displays orders and renders a radio-stepper (20/40/60/80/100) per item.
//   - Edit/save per-item progress (stored under order.productProgress).
//   - Sends an email notification automatically at 60% and 100%.
// Notes:
//   - "content unchanged": No functional changes, only re-organization & comments.
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import {
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
  useSendOrderNotificationMutation,
} from '../../../redux/features/orders/ordersApi';
import Swal from 'sweetalert2';
import { useTranslation } from 'react-i18next';

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------
const AdminOrdersProgress = () => {
  // ---------------------------------------------------------------------------
  // Hooks: Data fetching & mutations
  // ---------------------------------------------------------------------------
  const { data: orders, isLoading, refetch } = useGetAllOrdersQuery();
  const [updateOrder] = useUpdateOrderMutation();
  const [sendNotification] = useSendOrderNotificationMutation();

  // ---------------------------------------------------------------------------
  // Hooks: Local state
  // ---------------------------------------------------------------------------
  // progressChanges holds a flat map: { `${orderId}|${productKey}`: progressValue }
  // where productKey looks like `${productId}|${colorName}|${index}-${itemIndex}`.
  const [progressChanges, setProgressChanges] = useState({});
  // editingProductKey stores the currently editable `fullKey` (orderId|productKey)
  const [editingProductKey, setEditingProductKey] = useState(null);

  // i18n
  const { i18n } = useTranslation();
  const lang = i18n.language;

  // The radio step options for progress
  const progressSteps = [20, 40, 60, 80, 100];

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  // Load existing progress for all items when orders arrive / language changes
  useEffect(() => {
    if (orders) {
      const initial = {};

      orders.forEach(order => {
        const progressMap = order.productProgress || {};

        order.products.forEach((prod, index) => {
          // Resolve color name in the selected language
          const colorName =
            typeof prod.color.colorName === 'object'
              ? prod.color.colorName[lang] || prod.color.colorName.en
              : prod.color.colorName;

          // Create an entry for each item based on quantity
          for (let itemIndex = 0; itemIndex < prod.quantity; itemIndex++) {
            const productKey = `${prod.productId._id}|${colorName}|${index}-${itemIndex}`;
            const fullKey = `${order._id}|${productKey}`;
            initial[fullKey] = progressMap[productKey] ?? 0;
          }
        });
      });

      setProgressChanges(initial);
    }
  }, [orders, lang]);

  // Force left-to-right layout for this admin screen (per original code)
  useEffect(() => {
    document.documentElement.dir = 'ltr';
  }, []);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  // Update selected progress value in local state (only if the item is in edit mode)
  const handleCheckboxChange = (key, value) => {
    if (editingProductKey === key) {
      setProgressChanges(prev => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  // Enable editing mode for a specific item (identified by fullKey)
  const handleEdit = (productKey) => {
    setEditingProductKey(productKey);
  };

  // Persist a single item progress to DB and (optionally) send notification
  const handleSave = async (orderId, productKey) => {
    const fullKey = `${orderId}|${productKey}`;
    const updatedValue = progressChanges[fullKey];

    // Find the corresponding order
    const order = orders.find((o) => o._id === orderId);
    if (!order) {
      Swal.fire({
        title: 'Erreur',
        text: 'Commande non trouvée!',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: { confirmButton: 'btn btn-danger' },
      });
      return;
    }

    const email = order.email;

    // Build a new productProgress object merging the updated item
    const updatedProgress = {
      ...order.productProgress,
      [productKey]: updatedValue,
    };

    try {
      // 1) Save to database
      await updateOrder({
        orderId,
        productProgress: updatedProgress,
      }).unwrap();

      Swal.fire({
        title: 'Succès!',
        text: 'Le progrès de la commande a été enregistré avec succès.',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: { confirmButton: 'btn btn-success' },
      });

      // 2) Send notification at 60% or 100% (per original logic)
      if ([60, 100].includes(updatedValue) && productKey && email) {
        // productKey is `${productId}|${colorName}|${index}-${itemIndex}`
        // For the email, we remove the index part and keep `${productId}|${colorName}`
        const [productId, rawColorName] = productKey.split('|').slice(0, 2);
        const cleanColorName = rawColorName?.trim(); // already in selected lang
        const cleanProductKey = `${productId}|${cleanColorName}`;

        await sendNotification({
          orderId,
          email,
          productKey: cleanProductKey,
          progress: updatedValue,
        }).unwrap();

        Swal.fire({
          title: 'Notification envoyée',
          text: `Une notification a été envoyée à ${order.name} pour ${updatedValue}% de progression.`,
          icon: 'info',
          confirmButtonText: 'OK',
          customClass: { confirmButton: 'btn btn-info' },
        });
      }

      // Reset editing mode and refetch server state
      setEditingProductKey(null);
      refetch();
    } catch (error) {
      // Error alert (unchanged messages)
      console.error("❌ Erreur lors de l'enregistrement/notification:", error);
      Swal.fire({
        title: 'Erreur',
        text:
          error?.data?.message ||
          "Échec de l'enregistrement du progrès de la commande.",
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: { confirmButton: 'btn btn-danger' },
      });
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (isLoading) return <p>Chargement des commandes...</p>;

  return (
    <div className="p-4">
      {/* Page title */}
      <h2 className="text-xl font-bold mb-4">Gérer l'Avancement des Commandes</h2>

      {/* Orders list (scrollable container) */}
      <div className="max-h-[70vh] overflow-y-auto">
        {orders.map((order) => (
          <div key={order._id} className="border p-4 rounded mb-6">
            {/* Order header */}
            <h3 className="text-lg font-semibold mb-2 text-center">
              Commande #{order._id.slice(0, 10)} - {order.name}
            </h3>

            {/* Flatten each product into quantity-based items */}
            {order.products.flatMap((prod, index) => {
              // Localized color name
              const colorName =
                typeof prod.color.colorName === 'object'
                  ? prod.color.colorName[lang] || prod.color.colorName.en
                  : prod.color.colorName;

              // For each unit (quantity), render one row with its own progress selection
              return Array.from({ length: prod.quantity }, (_, itemIndex) => {
                const productKey = `${prod.productId._id}|${colorName}|${index}-${itemIndex}`;
                const fullKey = `${order._id}|${productKey}`;
                const currentValue = progressChanges[fullKey] ?? 0;

                // UI row per item
                return (
                  <div key={fullKey} className="mb-4 border-t pt-4 text-center">
                    {/* Item info */}
                    <p>
                      <strong>{prod.productId.title}</strong> — Couleur: {colorName}
                      <br />
                      <span className="text-gray-500 text-sm">
                        ID: {prod.productId._id} — Article #{itemIndex + 1}
                      </span>
                    </p>

                    {/* Progress radio stepper + edit/save button */}
                    <div className="flex flex-wrap gap-4 items-center mt-2 justify-center">
                      {progressSteps.map((val, stepIndex) => (
                        <label key={val} className="mr-4 flex flex-col items-center text-sm">
                          <span className="text-gray-500 text-xs mb-1">
                            Étape {stepIndex + 1}
                          </span>

                          <input
                            type="radio"
                            name={fullKey}
                            value={val}
                            checked={progressChanges[fullKey] === val}
                            onChange={() => handleCheckboxChange(fullKey, val)}
                            disabled={editingProductKey !== fullKey}
                          />

                          <span className="mt-1">{val}%</span>
                        </label>
                      ))}

                      {editingProductKey === fullKey ? (
                        <button
                          onClick={() => handleSave(order._id, productKey)}
                          className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Enregistrer
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEdit(fullKey)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                        >
                          Modifier
                        </button>
                      )}
                    </div>
                  </div>
                );
              });
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrdersProgress;
