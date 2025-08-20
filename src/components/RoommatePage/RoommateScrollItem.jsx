import React from 'react';
import { useNavigate } from 'react-router-dom';
import { makeAuthorizedRequest } from '@utils/makeAuthorizedRequest';
import { useQueryClient, useMutation } from '@tanstack/react-query';

//styles
import styled from 'styled-components';
import FONT from '@styles/fonts';
import COLOR from '@styles/color';

//images

const RoommateScrollItem = ({ post, type, setConfirm, setConfirmContent }) => {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const registerMutation = useMutation({
		mutationFn: (matchingRequestId) =>
			makeAuthorizedRequest('/api/v1/matchingrequests', 'post', {
				matchingRequestId,
			}),
		onSuccess: (data) => {
			if (data.status === 201) {
				queryClient.invalidateQueries(['matchingPosts', type]);
			}
		},
		onError: (error) => {},
	});
	const cancelMutation = useMutation({
		mutationFn: (matchingRequestId) =>
			makeAuthorizedRequest(
				`/api/v1/matchingrequests/${matchingRequestId}`,
				'delete',
			),
		onSuccess: (data) => {
			if (data.status === 204) {
				queryClient.invalidateQueries(['matchingPosts', type]);
			}
		},
		onError: (error) => {},
	});
	const handleClickRegisterBtn = async (e, matchingPostId) => {
		e.stopPropagation();

		setConfirm(true);
		setConfirmContent({
			id: -1,
			msg: `'${post.name}'님께 매칭을 신청할까요?`,
			btn: '수락',
			func: () => {
				registerMutation.mutate(matchingPostId);
			},
		});
	};
	const handleClickCancelBtn = async (e, matchingPostId) => {
		e.stopPropagation();

		setConfirm(true);
		setConfirmContent({
			id: -1,
			msg: `'${post.name}'님과의 매칭을 취소할까요?`,
			btn: '확인',
			func: () => {
				cancelMutation.mutate(matchingPostId);
			},
		});
	};
	const handleClickPost = (matchingPostId) => {
		if (typeof matchingPostId === 'object') {
			if (matchingPostId.id) {
				postId = matchingPostId.id;
			} else {
				return;
			}
		}
		navigate(`/post-detail/${matchingPostId}`);
	};
	const isMyMatchingRequests = type === 'my-matchingrequests';
	const isMatchingPending = post.matchingStatus === '매칭 대기';
	const isMatchingAccepted = post.matchingStatus === '매칭 수락';
	const isMatchingRejected = post.matchingStatus === '매칭 거절';
	const isMatchingClosed =
		post.matchingStatus === '매칭 완료' || post.matchingStatus === '매칭 마감';

	const renderStatus = () => {
		if (isMyMatchingRequests) {
			if (isMatchingPending) {
				return <div className="register text-right">대기중</div>;
			} else if (isMatchingAccepted) {
				return <div className="register text-right registered">수락됨</div>;
			} else if (isMatchingRejected) {
				return <div className="register text-right registered">거절됨</div>;
			}
		} else {
			if (isMatchingClosed) {
				return <div className="register text-right gray500">매칭 마감</div>;
			} else if (isMatchingPending) {
				return <div className="register text-right">{post.matchingStatus}</div>;
			}
		}
		return null; // 기본적으로 아무것도 렌더링하지 않음
	};

	return (
		<SettingStyle
			onClick={() => handleClickPost(post?.matchingPostId)}
			key={post.matchingPostId}
			className={`flex bg-white border border-[${COLOR.gray100}] rounded-[20px] p-[14px]`}
		>
			<img
				className="w-[100px] h-[100px] mr-[12px] rounded-[50%]"
				src={post.photoUrl}
			/>
			<div className="w-full flex flex-col justify-between">
				<div>
					<div className="flex items-center justify-between">
						<div>
							<span className="room mr-[10px]">
								{post.dong} {post.roomSize}
							</span>
							<span className="mates-number">
								모집인원 {post.targetNumberOfPeople}명
							</span>
						</div>
						{post.matchingStatus === '매칭 대기' && (
							<span className="dday">
								{post.dday === 0 ? 'D-Day' : `D-${post.dday}`}
							</span>
						)}
					</div>
					<div className="text-left mt-[7px]">
						<p
							className="roommate-title max-w-[205px] 
            whitespace-nowrap overflow-hidden text-ellipsis"
							onClick={handleClickPost}
						>
							{post.title}
						</p>
						<div>
							<span className="name mr-[6px]">{post.name}</span>
							<span className="gender">{post.gender}</span>
						</div>
					</div>
				</div>
				<div className="text-right">
					{/* 매칭 대기, 매칭 완료, 매칭 마감 */}
					{renderStatus()}
				</div>
			</div>
		</SettingStyle>
	);
};

export default RoommateScrollItem;

const SettingStyle = styled.div`
	.room {
		font-size: ${FONT.caption2M14};
		color: ${COLOR.purple1};
	}
	.mates-number {
		font-size: ${FONT.caption3M12};
	}
	.dday {
		font-size: ${FONT.caption2M14};
		color: ${COLOR.gray500};
	}
	.roommate-title {
		font-size: ${FONT.caption1SB14};
	}
	.roommate-title:hover {
		text-decoration: underline;
	}
	.name {
		font-size: ${FONT.caption2M14};
	}
	.gender {
		font-size: ${FONT.caption3M12};
		color: ${COLOR.gray500};
	}
	.register {
		font-size: ${FONT.caption2M14};
		color: ${COLOR.purple1};
		&.registered {
			color: ${COLOR.red};
		}
		&.gray500 {
			color: ${COLOR.gray500};
		}
	}
`;
