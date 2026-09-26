import styles from "./skeleton.module.scss";

export function SkeletonText({ fullWidth = true }) {
  return (
    <div
      className={`${styles.skeleton} ${fullWidth ? styles.fullWidth : ""}`}
    ></div>
  );
}

export function SkeletonInput() {
  return <div className={`${styles.skeleton} ${styles.skeletonInput}`}></div>;
}

export function SkeletonButton({ fullWidth = false }) {
  return (
    <div
      className={`${styles.skeleton} ${styles.skeletonButton} ${fullWidth ? styles.fullWidth : ""}`}
    ></div>
  );
}
