import React, { useState } from 'react';
import PropTypes from 'prop-types';

//
export const BasicInput = ({ onChangeValue, limitNum }) => {
	const [value, setValue] = useState('');

	const handleChange = (e) => {
		const inputValue = e.target.value;
		if (inputValue.length <= limitNum) {
			setValue(inputValue);
			onChangeValue(inputValue);
		}
	};

	return (
		<>
			<input
				className="w-4/5 pl-1 focus:outline-none"
				type="text"
				value={value}
				onChange={handleChange}
			/>
		</>
	);
};

BasicInput.propTypes = {
	onChangeValue: PropTypes.func.isRequired,
};

//
export const NumInput = () => {
	return (
		<>
			<div>NumInput</div>
		</>
	);
};

//
export const RadioInput = () => {
	return (
		<>
			<div>RadioInput</div>
		</>
	);
};

//
export const CheckboxInput = () => {
	return (
		<>
			<div>CheckboxInput</div>
		</>
	);
};
