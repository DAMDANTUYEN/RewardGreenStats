import { X } from "lucide-react";

import { formatVnd } from "@/lib/impact";

import { ImpactIcon } from "./ImpactIcon";
import styles from "./impactJourney.module.css";

export function ImpactDetailsSheet({
  item,
  onClose,
}) {
  return (
    <section className={styles.detailSheet} aria-label={`Chi tiết ${item.label}`}>
      <button
        type="button"
        className={styles.sheetClose}
        onClick={onClose}
        aria-label="Đóng chi tiết"
      >
        <X size={18} />
      </button>
      <span className={styles.sheetIcon}>
        <ImpactIcon name={item.icon} size={22} />
      </span>
      <div>
        <span className={styles.sheetEyebrow}>Phân bổ tác động</span>
        <h3>{item.label}</h3>
        <strong>{formatVnd(item.amount)}</strong>
        <p>{item.impactText}</p>
        {item.description && <small>{item.description}</small>}
      </div>
    </section>
  );
}
