const MINUTE_IN_SECOND = 60;
const HOUR_IN_SECOND = MINUTE_IN_SECOND * 60; // 3,600 seconds
const DAY_IN_SECOND = HOUR_IN_SECOND * 24; // 86,400 seconds
const YEAR_IN_SECOND = DAY_IN_SECOND * 365; // 31,536,000 seconds

const TimeUnitEnum = Object.freeze({
  Year: 'year',
  Day: 'day',
  Hour: 'hour',
  Minute: 'minute',
  Second: 'second'
});

/**
 * TimeUnitWithValue Interface is
 * {
 *   timeUnit: TimeUnitEnum,
 *   value: number
 * }
 */
const getTimeUnitWithValues = (timeInSecond) => {
  const timeUnitToValueMap = {
    [TimeUnitEnum.Year]: Math.floor(timeInSecond / YEAR_IN_SECOND),
    [TimeUnitEnum.Day]: Math.floor((timeInSecond % YEAR_IN_SECOND) / DAY_IN_SECOND),
    [TimeUnitEnum.Hour]: Math.floor(((timeInSecond % YEAR_IN_SECOND) % DAY_IN_SECOND) / HOUR_IN_SECOND),
    [TimeUnitEnum.Minute]: Math.floor((((timeInSecond % YEAR_IN_SECOND) % DAY_IN_SECOND) % HOUR_IN_SECOND) / MINUTE_IN_SECOND),
    [TimeUnitEnum.Second]: timeInSecond % MINUTE_IN_SECOND,
  };

  return Object.keys(TimeUnitEnum).map((key) => {
    const timeUnit = TimeUnitEnum[key];

    return {
      timeUnit,
      value: timeUnitToValueMap[timeUnit],
    };
  });
};

const transformToFormattedTime = ({ timeUnit, value }) => {
  const isPlural = value > 1;

  return `${value} ${timeUnit}${isPlural ? 's' : ''}`;
};

const formatDuration = (timeInSecond) => {
  if (timeInSecond === 0) {
    return 'now';
  }

  const timeUnitWithValues = getTimeUnitWithValues(timeInSecond);
  const filteredTimeUnitWithValues = timeUnitWithValues.filter(({ value, ...rest }) => value > 0);

  return filteredTimeUnitWithValues.length === 1 ?
    transformToFormattedTime(filteredTimeUnitWithValues[0]) :
    filteredTimeUnitWithValues.reduce((acc, filteredTimeUnitWithValue, index) => {
      const shouldSeparateByComma = index < filteredTimeUnitWithValues.length - 2;
      const shouldSeparateByAnd = index === filteredTimeUnitWithValues.length - 2;

      const formattedTime = transformToFormattedTime(filteredTimeUnitWithValue);

      return `${acc}${formattedTime}${shouldSeparateByComma ? ', ' : shouldSeparateByAnd ? ' and ' : ''}`;
    }, '');
}