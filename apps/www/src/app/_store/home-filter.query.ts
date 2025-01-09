import {
	createSearchParamsCache,
	parseAsArrayOf,
	parseAsIsoDate,
	parseAsString,
	parseAsStringLiteral,
} from "nuqs/server";

export const homeFilterParams = {
	// 搜索关键词
	search: parseAsArrayOf(parseAsString).withDefault([]),
	// 开始日期
	startDate: parseAsIsoDate,
	// 结束日期
	endDate: parseAsIsoDate,
	// 类型
	type: parseAsStringLiteral(["news", "trending"]).withDefault("news"),
};

export const homeFilterParamsCache = createSearchParamsCache(homeFilterParams);
