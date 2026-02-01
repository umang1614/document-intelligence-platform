function Dashboard() {
  return (
    <div style={styles.container}>
      <h1 style={styles.message}>Login successful</h1>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  message: {
    color: "#28a745",
    fontSize: "32px",
  },
};

export default Dashboard;
