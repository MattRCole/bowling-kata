const { calculateIndividualFrameScores, calculateRollingScore } = require('./index')

describe('#calculateIndividualFrameScores', () => {
  describe('accepts an array of bowling scores, and returns accurate frame scoring', () => {
    describe('without strikes or spares', () => {
      it('properly calculates a single frame', () => {
        const results = calculateIndividualFrameScores([1, 2])
        expect(results).toEqual([3])
      })
      it('properly calculates two frames', () => {
        const results = calculateIndividualFrameScores([1, 2, 3, 4])
        expect(results).toEqual([3, 7])
      })
      it('properly handles a frame in progress', () => {
        const results = calculateIndividualFrameScores([1])
        expect(results).toEqual([1])
      })
    })
    describe('with strikes or spares', () => {
      it('handles a single strike frame appropriately', () => {
        const results = calculateIndividualFrameScores([10, 0])
        expect(results).toEqual(['x'])
      })
      it('handles a single strike frame followed by a normal frame appropriately', () => {
        const results = calculateIndividualFrameScores([10, 0, 4, 2])
        expect(results).toEqual([16, 6])
      })
      it('handles a strike followed by a half frame', () => {
        const results = calculateIndividualFrameScores([10, 0, 5])
        expect(results).toEqual(['x', 5])
      })
      it('handles a strike followed by a strike and then a normal frmae', () => {
        const results = calculateIndividualFrameScores([10, 0, 10, 0, 3, 4])
        expect(results).toEqual([23, 17, 7])
      })
      it('handles a single spare frame appropriately', () => {
        const results = calculateIndividualFrameScores([7, 3])
        expect(results).toEqual(['-'])
      })
      it('handles a single spare frame followed by a normal frame appropriately', () => {
        const result = calculateIndividualFrameScores([7, 3, 5, 3])
        expect(result).toEqual([15, 8])
      })
      it('handles a single spare fame followed by a half frame appropriately', () => {
        const result = calculateIndividualFrameScores([5, 5, 5])
        expect(result).toEqual([15, 5])
      })
    })
    describe('with final frame', () => {
      const nineFrames = [
        1,0,2,0,3,0,4,0,5,0,6,0,7,0,8,0,9,0
      ]
      const nineFrameScores = [
        1,2,3,4,5,6,7,8,9
      ]
      describe('with one strike', () => {
        it('handles a strike and a gutter ball correctly', () => {
          const result = calculateIndividualFrameScores(nineFrames.concat([10, 0]))
          expect(result).toEqual(nineFrameScores.concat([10]))
        })
        it('handles a single strike correctly', () => {
          const result = calculateIndividualFrameScores(nineFrames.concat([10]))
          expect(result).toEqual(nineFrameScores.concat([10]))
        })
      })
      it('handles two strikes correctly', () => {
        const result = calculateIndividualFrameScores(nineFrames.concat([10, 10]))
        expect(result).toEqual(nineFrameScores.concat([20]))
      })
      it('handles three strikes correctly', () => {
        const result = calculateIndividualFrameScores(nineFrames.concat([10, 10, 10]))
        expect(result).toEqual(nineFrameScores.concat([30]))
      })
      it('handles non-strikes correctly', () => {
        const result = calculateIndividualFrameScores(nineFrames.concat([4,5]))
        expect(result).toEqual(nineFrameScores.concat([9]))
      })
      it('handles spares correctly', () => {
        const result = calculateIndividualFrameScores(nineFrames.concat([5, 5, 3]))
        expect(result).toEqual(nineFrameScores.concat([13]))
      })
    })
  })
})

describe('#calculateRollingScore', () => {
  describe('no strikes/spares', () => {
    it('handles multiple frames correctly', () => {
      const result = calculateRollingScore([1,2,3,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9,0])
      expect(result).toEqual([3, 10, 21, 36, 45, 48, 55, 66, 81, 90])
    })
  })
  describe('with strikes and spares', () => {
    it('handles strike frames without modifiers', () => {
      const result = calculateRollingScore([10, 0])
      expect(result).toEqual(['-'])
    })
  })
})