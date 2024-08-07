import React from 'react';
import { Link, useLocation } from 'react-router-dom';
//styles
import styled from 'styled-components';
import FONT from '@styles/fonts';
import COLOR from '@styles/color';

//images
import Premium from '@assets/images/premium-quality.svg';
import Next from '@assets/images/next.svg';

//components
import RoommateSwiperList from '@components/common/RoommateSwiperList';
import SearchAndNotice from '@components/common/SearchAndNotice';
import RoommateScrollList from '@common/RoommateScrollList';
import AddRoommateButton from '@common/button/AddRoommateButton';
const RoommatePage = () => {
	const location = useLocation();
	const filters = location.state;

	return (
		<SettingStyle className="bg-white flex flex-col gap-[10px] scroll-smooth">
			<AddRoommateButton />
			<div>
				<SearchAndNotice />
				<div>
					<div className="px-[25px] pt-[25px] bg-white">
						<div className="flex justify-between items-center pb-[10px]">
							<div className="flex">
								<h1 className="heading text-left font-bold mr-[3px]">
									베스트 룸메이트
								</h1>
								<img src={Premium} alt="best roommates icon" />
							</div>
							<Link to="/home/best-roommates" className="more flex">
								더보기
								<img src={Next} alt="see more icon" />
							</Link>
						</div>
					</div>
					<RoommateSwiperList type="best" />
				</div>
			</div>
			<RoommateScrollList type="new" filters={filters} />
		</SettingStyle>
	);
};

export default RoommatePage;

const SettingStyle = styled.div`
	background-color: ${COLOR.gray50};
	.heading {
		font-size: ${FONT.title4SB17};
	}
	.more {
		font-size: ${FONT.caption2M14};
	}
`;
