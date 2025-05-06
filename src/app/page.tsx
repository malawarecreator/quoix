import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <h1 style={{fontSize: 100}}>Quoix</h1>
      <p>Share information with others (anonymously)</p>
      <button type="button" style={{backgroundColor: "black", width: 100, height: 40, borderRadius: 30, margin: 20}}><a href="/post">Create</a></button>
      <button type="button" style={{backgroundColor: "black", width: 100, height: 40, borderRadius: 30, margin: 20}}><a href="/find">Find</a></button>
      <button type="button" style={{backgroundColor: "black", width: 100, height: 40, borderRadius: 30, margin: 20}}><a href="/delete">Delete</a></button>
    </div>
  );
}
