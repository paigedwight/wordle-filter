import { Container } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";
import WordleFilter from "./WordleFilter";

export default function App() {
    return (
        <Container style={{ maxWidth: "400px" }}>
            <WordleFilter />
        </Container>
    );
}
