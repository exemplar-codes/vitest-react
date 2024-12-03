import PropTypes from "prop-types";
import { render, screen } from "@testing-library/react";
import { useState, useEffect } from "react";
import { describe, test, expect } from "vitest";

const App2 = ({ id = "" }) => {
  const [showHello, setShowHello] = useState(false);

  useEffect(() => {
    console.log("Mounted");
    setTimeout(() => {
      setShowHello(true);
    }, 500);
  }, []);

  return (
    <div id={id}>
      {showHello ? <span>hello</span> : null}
      <span>world</span>
    </div>
  );
};

App2.propTypes = {
  id: PropTypes.string.isRequired,
};

describe("RTL demo", () => {
  test("visible check regex", async () => {
    render(<App2 id="1" />); // passes

    const messageNode = await screen.findByText("hello");
    expect(messageNode).toBeVisible(); // check if visible
  });

  test("visible check string", async () => {
    render(<App2 id="2" />); // fails
    const messageNode = await screen.findByText(/hello/i);
    expect(messageNode).toBeVisible(); // check if visible
  });
});
