import Header from '@common/header/Header';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import useAuthStore from '@store/authStore';

import * as SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

import Alarm from '@assets/images/common/alarm.svg';
import ExitIcon from '@assets/images/chat/Exit.svg';
import SendIcon from '@assets/images/chat/Send.svg';
import FONT from '@styles/fonts';
import COLOR from '@styles/color';
import { chatSeverURL, getChatHistory } from 'services/api/ChatAPI';
import { ImgWrapper } from '@common/ui/Profile';

const Chatroom = () => {
	const messageEndRef = useRef(null);
	const clientRef = useRef(null);
	const setAccessToken = useAuthStore((state) => state.setAccessToken);
	const accessToken = useAuthStore.getState().accessToken;
	const myInfo = {
		username: '김예은',
	};
	const { subscribeID } = useParams();
	const navigate = useNavigate();

	const [chats, setChat] = useState([]);
	const [message, setMessage] = useState('');

	const connectClient = () => {
		const socket = new SockJS(`${chatSeverURL}/oegaein`);

		clientRef.current = new Client({
			webSocketFactory: () => socket,
			debug: (str) => {
				console.log(str);
			},
			connectHeaders: {
				Authorization: `Bearer ${accessToken}`,
				roomId: subscribeID,
			},
			reconnectDelay: 5000,
			heartbeatIncoming: 300000,
			heartbeatOutgoing: 300000,

			onConnect: (frame) => {
				clientRef.current.subscribe(`/topic/${subscribeID}`, (message) => {
					setChat((prevChat) => [...prevChat, JSON.parse(message.body)]);
				});
			},

			onStompError: (frame) => {
				console.error('Broker reported error: ' + frame.headers['message']);
				console.error('Additional details: ' + frame.body);
			},

			onWebSocketClose: () => {
				console.log('WebSocket connection closed');
			},
		});

		clientRef.current.activate();
	};

	const checkChat = async () => {
		const result = await getChatHistory(subscribeID, setAccessToken);
		setChat(result.data);
	};

	useEffect(() => {
		connectClient();
		checkChat();

		return () => {
			clientRef.current.deactivate();
		};
	}, []);

	useEffect(() => {
		if (messageEndRef.current) {
			messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
		console.log(chats);
	}, [chats]);

	const inputMessage = (e) => {
		setMessage(e.target.value);
	};

	const sendHandler = () => {
		if (clientRef.current.connected) {
			clientRef.current.publish({
				destination: '/pub/message',
				body: JSON.stringify({
					message: message,
					messageStatus: 'MESSAGE',
				}),
			});
			setMessage('');
		} else {
			console.error('STOMP connection is not active.');
		}
	};

	const onDisconnect = () => {
		clientRef.current.deactivate();
		navigate(-1);
	};

	const onEnter = (e) => {
		if (e.keyCode === 13) {
			sendHandler();
		}
	};

	const isMyChat = (name) => {
		return name === myInfo.username;
	};

	const prevSender = (current, prev) => {
		return current === prev;
	};

	const nextSender = (current, next) => {
		return current === next;
	};

	return (
		<ChatContainer>
			<section className="pb-3 fixed top-0 z-10 bg-white border-b-black container">
				<Header
					backPath={'/chat'}
					rightContent={ConfirmMatching()}
					rightEvent={() => {
						alert('매칭 종료!');
					}}
				>
					<div className="flex">
						<p className="header mr-2">룸메이트 구해요!title</p>
						<p className="people">4</p>
					</div>
				</Header>
			</section>
			<section className="chatRoom">
				{chats.map((chat, index) => (
					<ChattingStyle key={index} isMyChat={isMyChat(chat.senderName)}>
						<ImgVisible
							className={isMyChat(chat.senderName) ? 'noneDisplay' : ''}
							visible={
								index > 0 &&
								prevSender(chat.senderName, chats[index - 1].senderName)
							}
						>
							<ImgWrapper mr={'10px'} width={'50px'} height={'50px'}>
								<img src={chat.photoUrl} alt="profile" className="img" />
							</ImgWrapper>
						</ImgVisible>
						<div className="flex flex-col">
							<div
								className={
									isMyChat(chat.senderName) ||
									prevSender(chat.senderName, chats[index - 1].senderName)
										? 'noneDisplay '
										: 'name'
								}
							>
								{chat.senderName}
							</div>
							<div
								className={`chat ${isMyChat(chat.senderName) ? 'myChat' : 'yourChat'} ${
									index > 0 &&
									prevSender(chat.senderName, chats[index - 1].senderName)
										? nextSender(chat.senderName, chats[index + 1]?.senderName)
											? 'middleMsg'
											: 'endMsg'
										: ''
								}`}
							>
								{chat.message}
							</div>
						</div>
						<div ref={messageEndRef}></div>
					</ChattingStyle>
				))}
			</section>
			<InputStyle>
				<div className="input_box">
					<input
						className="input"
						type="text"
						placeholder="메세지 보내기..."
						onChange={inputMessage}
						onKeyDown={onEnter}
						value={message}
					/>
					<button
						className={message.length === 0 ? 'noneDisplay' : ''}
						onClick={sendHandler}
					>
						<img src={SendIcon} alt="send" />
					</button>
				</div>
				<button onClick={onDisconnect}>
					<img src={ExitIcon} alt="exit" />
				</button>
			</InputStyle>
			<br />
		</ChatContainer>
	);
};

export default Chatroom;

const ConfirmMatching = () => {
	return (
		<BtnStyle>
			<p>매칭 종료</p>
		</BtnStyle>
	);
};

const ChatContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 100%;
	height: 100vh;
	overflow: hidden;
	touch-action: none;

	.container {
		display: flex;
		padding: 25px 25px 10px 25px;
		width: 100%;
		border-bottom: 1px solid ${COLOR.gray100};
		margin-bottom: 10px;
	}
	.header {
		font: ${FONT.title4SB17};
	}
	.people {
		font: ${FONT.title4SB17};
		color: ${COLOR.gray400};
	}
	.chatRoom {
		width: 100%;
		padding: 50px 25px 0px 25px;
		overflow-y: auto;
	}
	.noneDisplay {
		display: none;
	}
`;

const ChattingStyle = styled.div`
	display: flex;
	width: 100%;
	margin-bottom: 4px;
	flex-direction: 'row-reverse';
	flex-direction: ${({ isMyChat }) => (isMyChat ? 'row-reverse' : 'row')};

	.name {
		display: flex;
		justify-content: flex-start;
		margin-bottom: 2px;
		font: ${FONT.caption3M12};
		color: ${COLOR.gray800};
	}

	.chat {
		position: relative;
		display: inline-block;
		max-width: 100%;
		padding: 11px;
		font: ${FONT.body5M15};
	}

	.myChat {
		background-color: ${COLOR.purple2};
		border-radius: 20px 20px 3px 20px;
	}

	.yourChat {
		background-color: ${COLOR.purple3};
		border-radius: 20px 20px 20px 3px;
	}

	.middleMsg {
		border-radius: ${({ isMyChat }) =>
			isMyChat ? '20px 3px 3px 20px' : '3px 20px 20px 3px'};
	}

	.endMsg {
		border-radius: ${({ isMyChat }) =>
			isMyChat ? '20px 3px 20px 20px' : '3px 20px 20px 20px'};
	}
`;

const BtnStyle = styled.div`
	border-radius: 20px;
	padding: 8px 11px;
	background-color: ${COLOR.purple1};

	> p {
		font: ${FONT.caption2M14};
		color: ${COLOR.white};
	}
`;

const InputStyle = styled.div`
	display: flex;
	justify-content: center;
	background-color: white;

	padding: 25px 25px;
	position: fixed;
	bottom: 8%;
	width: 100%;

	.input_box {
		display: flex;
		justify-content: space-between;
		margin-right: 17px;
		width: 90%;
		padding: 14px;
		background-color: ${COLOR.purple2};
		border-radius: 10px;
	}

	.input {
		width: 100%;
		background-color: transparent;
	}

	.input:focus {
		outline: none;
	}
`;

const ImgVisible = styled.div`
	width: 50px;
	height: 50px;
	margin-right: 10px;
	opacity: ${({ visible }) => (visible ? 0 : 1)};
`;
