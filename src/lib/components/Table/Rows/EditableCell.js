import React from "react";
import PropTypes from "prop-types";

const inputStyle = {
  border: 0,
  padding: 4,
  width: "100%",
  background: "transparent",
};
// Create an editable cell renderer
const EditableCell = ({
  value: initialValue,
  row: { index,original },
  column: { id },
  updateMyData, // This is a custom function that we supplied to our table instance
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState(initialValue);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  // We'll only update the external data when the input is blurred
  const onBlur = () => {
    updateMyData(index, id, value);
  };

  // If the initialValue is changed externall, sync it up with our state
  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <input
      style={inputStyle}
      value={value !== undefined ? value : ''}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

EditableCell.propTypes = {
  cell: PropTypes.shape({
    value: PropTypes.any,
  }),
  row: PropTypes.shape({
    index: PropTypes.number.isRequired,
  }),
  column: PropTypes.shape({
    id: PropTypes.any.isRequired,
  }),
  updateMyData: PropTypes.func.isRequired,
};

export default EditableCell;
