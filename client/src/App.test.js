import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders home hero title", () => {
  render(<App />);
  const titulo = screen.getByText(/Muebles con alma, hechos para durar/i);
  expect(titulo).toBeInTheDocument();
});
