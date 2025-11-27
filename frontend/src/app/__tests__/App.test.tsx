import { render, screen } from "@testing-library/react";
import App from "../App";
import { Provider } from "react-redux";
import { store } from "../store";

describe("App", () => {
  test("title rendered", () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );
    expect(screen.getByText("Todo App")).toBeInTheDocument();
  });
});
