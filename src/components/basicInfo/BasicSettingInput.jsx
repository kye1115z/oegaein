import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, ContainerStyle } from '@styles/basicInfo/Input';
import Xbutton from '@assets/images/common/Xbutton.svg';
import { DropdownWrapper } from '@common/dropdown/BasicDropdown';
import { postCommentsAPI, postReplyAPI } from 'services/api/CommentsAPI';

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

	const handleClear = () => {
		setValue('');
		onChangeValue('');
	};

	return (
		<>
			<div className="flex w-full border-b border-solid border-[#DEDEDE]">
				<input
					className="w-full pl-[15px] pb-[11px] focus:outline-none"
					type="text"
					value={value}
					onChange={handleChange}
				/>
				{value !== '' && (
					<button onClick={handleClear}>
						<img src={Xbutton} alt="button" />
					</button>
				)}
			</div>
		</>
	);
};

BasicInput.propTypes = {
	onChangeValue: PropTypes.func.isRequired,
};

//
export const NumInput = ({ setSelected }) => {
	const [value, setValue] = useState('');

	const handleInputChange = (e) => {
		const regex = /^\d{4}-\d{2}-\d{2}$/;
		let val = e.target.value.replace(/\D/g, '');

		const yyyy = val.slice(0, 4);
		const mm = val.slice(4, 6);
		const dd = val.slice(6, 8);

		if (yyyy && yyyy.length >= 4) {
			val = `${yyyy}-${mm}`;
		}
		if (mm && mm.length >= 2) {
			val = `${yyyy}-${mm}-${dd}`;
		}

		setValue(val);

		if (regex.test(val)) {
			setSelected(val);
		} else {
			setSelected(null);
		}
	};

	return (
		<>
			<Input
				type="text"
				inputMode="numeric"
				placeholder="YYYY-MM-DD"
				value={value}
				onChange={handleInputChange}
			/>
		</>
	);
};

//
export const RadioInput = ({
	type,
	checked,
	width,
	height,
	children,
	onSelect,
}) => {
	const handleClick = (value) => {
		onSelect(value);
	};

	return (
		<>
			<ContainerStyle
				onClick={() => handleClick(type)}
				checked={checked}
				width={width}
				height={height}
			>
				<label>
					<input type="radio" value={type} />
					{children}
				</label>
			</ContainerStyle>
		</>
	);
};

RadioInput.propTypes = {
	width: PropTypes.string.isRequired,
	height: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired,
	onSelect: PropTypes.func.isRequired,
};

//
export const CheckboxInput = ({
	item,
	width,
	height,
	children,
	onSelect,
	checked,
}) => {
	const handleClick = (value) => {
		onSelect(value);
	};
	return (
		<>
			<ContainerStyle
				style={{ justifyContent: 'center' }}
				onClick={() => handleClick(item)}
				checked={checked}
				width={width}
				height={height}
			>
				<input type="checkbox" />
				{children}
			</ContainerStyle>
		</>
	);
};

//
export const CommentInput = ({ setSelected, setReply, postId }) => {
	const [value, setValue] = useState('');

	const handleChange = (e) => {
		const inputValue = e.target.value;
		setValue(inputValue);
		setSelected(inputValue);
	};

	const handlePost = () => {
		// setReply(false);
		// postCommentsAPI(postId, value);
		postReplyAPI(postId, value);
		window.location.reload();
	};

	return (
		<>
			<DropdownWrapper
				style={{
					padding: '20px 15px',
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<input
					type="text"
					placeholder="댓글을 입력해주세요"
					value={value}
					onChange={handleChange}
					className="cation2"
					style={{
						width: '80%',
						outline: 'none',
					}}
				/>
				<button
					className={value.length > 1 ? 'color-purple' : 'color-gray'}
					onClick={handlePost}
				>
					등록
				</button>
			</DropdownWrapper>
		</>
	);
};
