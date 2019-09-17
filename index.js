const R = require('ramda')

const eleventhFrameIndex = 10

const isStrike = frame => R.equals(10, R.prop(0, frame)) && R.equals(0, R.prop(1, frame))

const isFullFrame = ([a, b]) => R.not(R.isNil(b))

const isSpare = (frame) => R.not(R.equals(10, R.prop(0, frame))) && R.sum(frame) === 10

const getStrikeModifier = ([nextFrame, followingNextFrame]) => {
  return isStrike(nextFrame) ? R.add(10, R.prop(0, followingNextFrame)) : R.reduce(R.add, 0, nextFrame)
}

const canGetStrikeModifier = ([nextFrame, followingNextFrame]) => {
  return nextFrame && isFullFrame(nextFrame) && (!isStrike(nextFrame) || followingNextFrame)
}

const getSpareModifier = R.head

const calculateFrameScore = (nextFrames, currentFrame) => { 
  const [nextFrame] = nextFrames
  let sum = R.sum(currentFrame)
  if(isStrike(currentFrame)) {
    sum = canGetStrikeModifier(nextFrames) ? sum + getStrikeModifier(nextFrames) : 'x'
  }
  if(isSpare(currentFrame)) {
    sum = nextFrame ? sum + getSpareModifier(nextFrame) : '-'
  }
  return [[currentFrame, nextFrame], sum]
}

const mergeLastTwoFrames = R.pipe(
  R.takeLast(2),
  R.sum,
  R.append(R.__, [])
)

const fixExtraFrameIfNecessary = R.ifElse(
  R.has(eleventhFrameIndex),
  R.converge(R.concat, [
    R.take(9),
    mergeLastTwoFrames]),
  R.identity
)

const calculateIndividualFrameScores = R.pipe(
  R.splitEvery(2),
  R.mapAccumRight(calculateFrameScore, [null]),
  R.prop(1),
  fixExtraFrameIfNecessary
)

function calculateRollingScore(bowlingPoints) {
  return R.pipe(
    calculateIndividualFrameScores,
    R.mapAccum((score, currentFrame) => {
      if(R.is(String, currentFrame)) return ['-', '-']
      score += currentFrame
      return [score, score]
    }, 0),
    R.prop(1)
    )(bowlingPoints)
}

module.exports = {
  calculateIndividualFrameScores,
  calculateRollingScore
}
