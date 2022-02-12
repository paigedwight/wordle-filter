import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import WordleFilter from "./WordleFilter";

export default function App() {
    return (
        <Container
            style={{ maxWidth: "400px", padding: "20px", textAlign: "center" }}
        >
            <h1 style={{ marginBottom: "20px", fontSize: "36px" }}>
                Wordle Filter
            </h1>
            <WordleFilter />
        </Container>
    );
}
