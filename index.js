const R = require('ramda')

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

const hasTenthFrame = arr => !R.isNil(R.prop(9, arr))

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

const handleFirst9Frames = reference10thframe => R.pipe(
  R.take(9),
  R.mapAccumRight(calculateFrameScore, [reference10thframe]),
  R.prop(1)
)

const handle10thFrame = R.pipe(
  R.drop(9),
  R.flatten,
  R.sum,
  R.append(R.__, [])
)

const handle10FrameGame = frames => {
  return R.pipe(
    R.converge(
      R.concat,
      [handleFirst9Frames(R.prop(9,frames)), handle10thFrame]
    )
  )(frames)
}
const calculateIndividualFrameScores = R.pipe(
  R.splitEvery(2),
  R.ifElse(
    hasTenthFrame,
    handle10FrameGame,
    R.pipe(R.mapAccumRight(calculateFrameScore, [null]), R.prop(1))
  )
)

const sumFrameScores = R.pipe(
  R.mapAccum((score, currentFrameScore) => {
    if(R.is(String, currentFrameScore) || R.is(String, score)) return ['-', '-']
    const updatedScore = score + currentFrameScore
    return [updatedScore, updatedScore]
  }, 0),
  R.prop(1)
)

const calculatePointTotal = R.pipe(
  calculateIndividualFrameScores,
  sumFrameScores
)
 
module.exports = {
  calculateIndividualFrameScores,
  calculatePointTotal
}
