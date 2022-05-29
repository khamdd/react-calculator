import { useReducer } from "react";
import "./app.css";
import DigitButton from "./components/DigitButton";
import OperationButton from "./components/OperationButton";

// 1. Initial State: {}

const initState = {
  currentOperand: "",
  previousOperand: "",
  operation: "",
};
// 2. Actions
export const ACTIONS = {
  ADD_DIGIT: "add_digit",
  CHOOSE_OPERATION: "add_operation",
  DELETE: "del",
  CLEAR: "clear",
  EVALUATE: "evaluate",
};

// 3. Reducer

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (state.currentOperand === "0" && payload.digit === "0") return state;
      if (state.currentOperand.includes(".") && payload.digit === ".")
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION: {
      if (state.currentOperand === "" && state.previousOperand === "") {
        return state;
      }
      if (state.previousOperand === "") {
        return {
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: "",
        };
      }
      if (state.currentOperand === "") {
        return {
          ...state,
          operation: payload.operation,
        };
      }
      return {
        operation: payload.operation,
        previousOperand: evaluate(state),
        currentOperand: "",
      };
    }

    case ACTIONS.DELETE:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: "",
        };
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };
    case ACTIONS.CLEAR:
      return initState;
    case ACTIONS.EVALUATE:
      if (
        state.currentOperand === "" ||
        state.previousOperand === "" ||
        state.operation === ""
      ) {
        return state;
      }
      return {
        operation: "",
        currentOperand: evaluate(state),
        previousOperand: "",
        overwrite: true,
      };
    default:
      console.error("error");
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);
  let computation = "";
  if (isNaN(prev) || isNaN(curr)) return "";

  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "*":
      computation = prev * curr;
      break;
    case "/":
      computation = prev / curr;
      break;
    default:
      console.log("Error!");
  }

  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand === "") {
    return;
  }
  const [integer, decimal] = operand.split(".");
  if (decimal === undefined) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    initState
  );

  return (
    <div className="calculator-wrapper">
      <div className="header">
        <div className="previous-operator">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="current-operator">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button
        onClick={() => {
          dispatch({ type: ACTIONS.DELETE });
        }}
      >
        Del
      </button>
      <OperationButton dispatch={dispatch} operation="/" />
      <DigitButton dispatch={dispatch} digit="1" />
      <DigitButton dispatch={dispatch} digit="2" />
      <DigitButton dispatch={dispatch} digit="3" />
      <OperationButton dispatch={dispatch} operation="*" />
      <DigitButton dispatch={dispatch} digit="4" />
      <DigitButton dispatch={dispatch} digit="5" />
      <DigitButton dispatch={dispatch} digit="6" />
      <OperationButton dispatch={dispatch} operation="+" />
      <DigitButton dispatch={dispatch} digit="7" />
      <DigitButton dispatch={dispatch} digit="8" />
      <DigitButton dispatch={dispatch} digit="9" />
      <OperationButton dispatch={dispatch} operation="-" />
      <DigitButton dispatch={dispatch} digit="." />
      <DigitButton dispatch={dispatch} digit="0" />
      <button
        className="span-two"
        onClick={() => {
          dispatch({ type: ACTIONS.EVALUATE });
        }}
      >
        =
      </button>
    </div>
  );
}

export default App;
