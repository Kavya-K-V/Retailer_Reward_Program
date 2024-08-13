import { render, screen } from "@testing-library/react";
import App from "./App";
import userEvent from "@testing-library/user-event";

describe("App", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  test("renders users when API call succeeds", async () => {
    const fakeUsers = [
      {
        customer: "Kevin",
        date: "02-01-2023",
        amount: 120,
      },
      {
        customer: "Kevin",
        date: "01-03-2023",
        amount: 100,
      },
      {
        customer: "Kiran",
        date: "03-03-2023",
        amount: 180,
      },
      {
        customer: "Kiran",
        date: "03-02-2023",
        amount: 200,
      },
      {
        customer: "John",
        date: "01-01-2023",
        amount: 50,
      },
      {
        customer: "John",
        date: "02-02-2023",
        amount: 100,
      },
      {
        customer: "John",
        date: "03-03-2023",
        amount: 300,
      },
    ];

    jest.spyOn(global, "fetch").mockImplementationOnce(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(fakeUsers),
      })
    );

    render(<App />);
    await screen.findAllByText("Kevin");

    userEvent.click(screen.getByText("View Monthly Data"))
    await screen.findByText("Kiran");
    userEvent.click(screen.getByText("Kiran"))
    userEvent.click(screen.getByText("Back to main page"))
  });
});
