import { d4 as computeStrides } from './index-a0f0add6.js';

/**
 * Validate gather nd inputs.
 *
 * @param tensor The tensor contains the source values.
 * @param indices The tensor contains the indices to slice the source.
 *
 * @returns [resultShape, numUpdates, sliceSize, strides]
 */
function prepareAndValidate(tensor, indices) {
    if (tensor.rank < 1) {
        throw new Error('tf.gatherND() expects the input to be rank 1 or higher,' +
            ` but the rank was ${tensor.rank}.`);
    }
    if (indices.rank < 1) {
        throw new Error('tf.gatherND() expects the indices to be rank 1 or higher,' +
            ` but the rank was ${indices.rank}.`);
    }
    if (indices.dtype !== 'int32') {
        throw new Error('tf.gatherND() expects the indices to be int32 type,' +
            ` but the dtype was ${indices.dtype}.`);
    }
    if (indices.shape[indices.rank - 1] > tensor.rank) {
        throw new Error('index innermost dimension length must be <= tensor rank; saw: ' +
            `${indices.shape[indices.rank - 1]} vs. ${tensor.rank}`);
    }
    if (tensor.size === 0) {
        throw new Error('Requested more than 0 entries, but input is empty.' +
            ` Input shape: ${tensor.shape}.`);
    }
    const indicesShape = indices.shape;
    const sliceRank = indicesShape[indicesShape.length - 1];
    // The result shape is
    //   indices.shape[:-1] + params.shape[indices.shape[-1]:]
    let nResult = 1;
    for (let i = 0; i < indicesShape.length - 1; ++i) {
        nResult *= indicesShape[i];
    }
    const inputShape = tensor.shape;
    const resultShape = indicesShape.slice();
    resultShape.pop();
    let sliceSize = 1;
    for (let i = sliceRank; i < tensor.rank; ++i) {
        sliceSize *= inputShape[i];
        resultShape.push(inputShape[i]);
    }
    const strides = [...computeStrides(tensor.shape).map(stride => stride / sliceSize),
        1].slice(0, sliceRank);
    return [resultShape, nResult, sliceSize, strides];
}

var gather_nd_util = /*#__PURE__*/Object.freeze({
    __proto__: null,
    prepareAndValidate: prepareAndValidate
});

/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
const EPSILON_FLOAT32 = 1e-7;
const EPSILON_FLOAT16 = 1e-4;
/** Convenient class for storing tensor-related data. */
class DataStorage {
    constructor(backend, dataMover) {
        this.backend = backend;
        this.dataMover = dataMover;
        this.data = new WeakMap();
        this.dataIdsCount = 0;
    }
    get(dataId) {
        if (!this.data.has(dataId)) {
            this.dataMover.moveData(this.backend, dataId);
        }
        return this.data.get(dataId);
    }
    set(dataId, value) {
        this.dataIdsCount++;
        this.data.set(dataId, value);
    }
    has(dataId) {
        return this.data.has(dataId);
    }
    delete(dataId) {
        this.dataIdsCount--;
        return this.data.delete(dataId);
    }
    numDataIds() {
        return this.dataIdsCount;
    }
}
/**
 * The interface that defines the kernels that should be implemented when
 * adding a new backend. New backends don't need to implement every one of the
 * methods, this can be done gradually (throw an error for unimplemented
 * methods).
 */
class KernelBackend {
    time(f) {
        return notYetImplemented('time');
    }
    read(dataId) {
        return notYetImplemented('read');
    }
    readSync(dataId) {
        return notYetImplemented('readSync');
    }
    numDataIds() {
        return notYetImplemented('numDataIds');
    }
    disposeData(dataId) {
        return notYetImplemented('disposeData');
    }
    write(values, shape, dtype) {
        return notYetImplemented('write');
    }
    move(dataId, values, shape, dtype) {
        return notYetImplemented('move');
    }
    memory() {
        return notYetImplemented('memory');
    }
    /** Returns the highest precision for floats in bits (e.g. 16 or 32) */
    floatPrecision() {
        return notYetImplemented('floatPrecision');
    }
    /** Returns the smallest representable number.  */
    epsilon() {
        return this.floatPrecision() === 32 ? EPSILON_FLOAT32 : EPSILON_FLOAT16;
    }
    batchMatMul(a, b, transposeA, transposeB) {
        return notYetImplemented('batchMatMul');
    }
    fusedBatchMatMul({ a, b, transposeA, transposeB, bias, activation, preluActivationWeights }) {
        return notYetImplemented('fusedBatchMatMul');
    }
    slice(x, begin, size) {
        return notYetImplemented('slice');
    }
    stridedSlice(x, begin, end, strides) {
        return notYetImplemented('stridedSlice');
    }
    unstack(x, axis) {
        return notYetImplemented('unstack');
    }
    reverse(a, axis) {
        return notYetImplemented('reverse');
    }
    concat(tensors, axis) {
        return notYetImplemented('concat');
    }
    neg(a) {
        return notYetImplemented('neg');
    }
    add(a, b) {
        return notYetImplemented('add');
    }
    addN(tensors) {
        return notYetImplemented('addN');
    }
    subtract(a, b) {
        return notYetImplemented('subtract');
    }
    multiply(a, b) {
        return notYetImplemented('multiply');
    }
    realDivide(a, b) {
        return notYetImplemented('realDivide');
    }
    floorDiv(a, b) {
        return notYetImplemented('floorDiv');
    }
    sum(x, axes) {
        return notYetImplemented('sum');
    }
    prod(x, axes) {
        return notYetImplemented('prod');
    }
    unsortedSegmentSum(x, segmentIds, numSegments) {
        return notYetImplemented('unsortedSegmentSum');
    }
    argMin(x, axis) {
        return notYetImplemented('argMin');
    }
    argMax(x, axis) {
        return notYetImplemented('argMax');
    }
    equal(a, b) {
        return notYetImplemented('equal');
    }
    notEqual(a, b) {
        return notYetImplemented('notEqual');
    }
    less(a, b) {
        return notYetImplemented('less');
    }
    lessEqual(a, b) {
        return notYetImplemented('lessEqual');
    }
    greater(a, b) {
        return notYetImplemented('greater');
    }
    greaterEqual(a, b) {
        return notYetImplemented('greaterEqual');
    }
    logicalNot(a) {
        return notYetImplemented('logicalNot');
    }
    logicalAnd(a, b) {
        return notYetImplemented('logicalAnd');
    }
    logicalOr(a, b) {
        return notYetImplemented('logicalOr');
    }
    where(condition) {
        return notYetImplemented('where');
    }
    select(condition, a, b) {
        return notYetImplemented('select');
    }
    topk(x, k, sorted) {
        return notYetImplemented('topk');
    }
    min(x, axes) {
        return notYetImplemented('min');
    }
    minimum(a, b) {
        return notYetImplemented('minimum');
    }
    mod(a, b) {
        return notYetImplemented('mod');
    }
    max(x, axes) {
        return notYetImplemented('max');
    }
    maximum(a, b) {
        return notYetImplemented('maximum');
    }
    all(x, axes) {
        return notYetImplemented('all');
    }
    any(x, axes) {
        return notYetImplemented('any');
    }
    squaredDifference(a, b) {
        return notYetImplemented('squaredDifference');
    }
    ceil(x) {
        return notYetImplemented('ceil');
    }
    floor(x) {
        return notYetImplemented('floor');
    }
    round(x) {
        return notYetImplemented('round');
    }
    sign(x) {
        return notYetImplemented('sign');
    }
    isNaN(x) {
        return notYetImplemented('isNaN');
    }
    isInf(x) {
        return notYetImplemented('isInf');
    }
    isFinite(x) {
        return notYetImplemented('isFinite');
    }
    pow(a, b) {
        return notYetImplemented('pow');
    }
    exp(x) {
        return notYetImplemented('exp');
    }
    expm1(x) {
        return notYetImplemented('expm1');
    }
    softmax(x, dim) {
        return notYetImplemented('softmax');
    }
    log(x) {
        return notYetImplemented('log');
    }
    log1p(x) {
        return notYetImplemented('log1p');
    }
    sqrt(x) {
        return notYetImplemented('sqrt');
    }
    rsqrt(x) {
        return notYetImplemented('rsqrt');
    }
    square(x) {
        return notYetImplemented('square');
    }
    reciprocal(x) {
        return notYetImplemented('reciprocal');
    }
    relu(x) {
        return notYetImplemented('relu');
    }
    relu6(x) {
        return notYetImplemented('relu6');
    }
    prelu(x, a) {
        return notYetImplemented('prelu');
    }
    elu(x) {
        return notYetImplemented('elu');
    }
    eluDer(dy, y) {
        return notYetImplemented('eluDer');
    }
    selu(x) {
        return notYetImplemented('selu');
    }
    int(x) {
        return notYetImplemented('int');
    }
    clip(x, min, max) {
        return notYetImplemented('clip');
    }
    abs(x) {
        return notYetImplemented('abs');
    }
    complexAbs(x) {
        return notYetImplemented('complexAbs');
    }
    sigmoid(x) {
        return notYetImplemented('sigmoid');
    }
    softplus(x) {
        return notYetImplemented('softplus');
    }
    sin(x) {
        return notYetImplemented('sin');
    }
    cos(x) {
        return notYetImplemented('cos');
    }
    tan(x) {
        return notYetImplemented('tan');
    }
    asin(x) {
        return notYetImplemented('asin');
    }
    acos(x) {
        return notYetImplemented('acos');
    }
    atan(x) {
        return notYetImplemented('atan');
    }
    atan2(a, b) {
        return notYetImplemented('atan2');
    }
    sinh(x) {
        return notYetImplemented('sinh');
    }
    cosh(x) {
        return notYetImplemented('cosh');
    }
    tanh(x) {
        return notYetImplemented('tanh');
    }
    asinh(x) {
        return notYetImplemented('asinh');
    }
    acosh(x) {
        return notYetImplemented('acosh');
    }
    atanh(x) {
        return notYetImplemented('atanh');
    }
    erf(x) {
        return notYetImplemented('erf');
    }
    step(x, alpha) {
        return notYetImplemented('step');
    }
    fusedConv2d({ input, filter, convInfo, bias, activation, preluActivationWeights }) {
        return notYetImplemented('fusedConv2d');
    }
    conv2d(x, filter, convInfo) {
        return notYetImplemented('conv2d');
    }
    conv2dDerInput(dy, filter, convInfo) {
        return notYetImplemented('conv2dDerInput');
    }
    conv2dDerFilter(x, dY, convInfo) {
        return notYetImplemented('conv2dDerFilter');
    }
    fusedDepthwiseConv2D({ input, filter, convInfo, bias, activation, preluActivationWeights }) {
        return notYetImplemented('fusedDepthwiseConv2D');
    }
    depthwiseConv2D(input, filter, convInfo) {
        return notYetImplemented('depthwiseConv2D');
    }
    depthwiseConv2DDerInput(dy, filter, convInfo) {
        return notYetImplemented('depthwiseConv2DDerInput');
    }
    depthwiseConv2DDerFilter(x, dY, convInfo) {
        return notYetImplemented('depthwiseConv2DDerFilter');
    }
    conv3d(x, filter, convInfo) {
        return notYetImplemented('conv3d');
    }
    conv3dDerInput(dy, filter, convInfo) {
        return notYetImplemented('conv3dDerInput');
    }
    conv3dDerFilter(x, dY, convInfo) {
        return notYetImplemented('conv3dDerFilter');
    }
    maxPool(x, convInfo) {
        return notYetImplemented('maxPool');
    }
    maxPoolBackprop(dy, x, y, convInfo) {
        return notYetImplemented('maxPoolBackprop');
    }
    avgPool(x, convInfo) {
        return notYetImplemented('avgPool');
    }
    avgPoolBackprop(dy, x, convInfo) {
        return notYetImplemented('avgPoolBackprop');
    }
    avgPool3d(x, convInfo) {
        return notYetImplemented('avgPool3d');
    }
    avgPool3dBackprop(dy, x, convInfo) {
        return notYetImplemented('avgPool3dBackprop');
    }
    maxPool3d(x, convInfo) {
        return notYetImplemented('maxPool3d');
    }
    maxPool3dBackprop(dy, x, y, convInfo) {
        return notYetImplemented('maxPool3dBackprop');
    }
    reshape(x, shape) {
        return notYetImplemented('reshape');
    }
    cast(x, dtype) {
        return notYetImplemented('cast');
    }
    tile(x, reps) {
        return notYetImplemented('tile');
    }
    pad(x, paddings, constantValue) {
        return notYetImplemented('pad');
    }
    transpose(x, perm) {
        return notYetImplemented('transpose');
    }
    gather(x, indices, axis) {
        return notYetImplemented('gather');
    }
    gatherND(x, indices) {
        return notYetImplemented('gatherND');
    }
    scatterND(indices, updates, shape) {
        return notYetImplemented('scatterND');
    }
    batchToSpaceND(x, blockShape, crops) {
        return notYetImplemented('batchToSpaceND');
    }
    spaceToBatchND(x, blockShape, paddings) {
        return notYetImplemented('spaceToBatchND');
    }
    resizeBilinear(x, newHeight, newWidth, alignCorners) {
        return notYetImplemented('resizeBilinear');
    }
    resizeBilinearBackprop(dy, x, alignCorners) {
        return notYetImplemented('resizeBilinearBackprop');
    }
    resizeNearestNeighbor(x, newHEight, newWidth, alignCorners) {
        return notYetImplemented('resizeNearestNeighbor');
    }
    resizeNearestNeighborBackprop(dy, x, alignCorners) {
        return notYetImplemented('resizeNearestNeighborBackprop');
    }
    batchNorm(x, mean, variance, offset, scale, varianceEpsilon) {
        return notYetImplemented('batchNorm');
    }
    localResponseNormalization4D(x, radius, bias, alpha, beta) {
        return notYetImplemented('localResponseNormalization4D');
    }
    LRNGrad(dy, inputImage, outputImage, radius, bias, alpha, beta) {
        return notYetImplemented('LRNGrad');
    }
    multinomial(logits, normalized, numSamples, seed) {
        return notYetImplemented('multinomial');
    }
    oneHot(indices, depth, onValue, offValue) {
        return notYetImplemented('oneHot');
    }
    cumsum(x, axis, exclusive, reverse) {
        return notYetImplemented('cumsum');
    }
    nonMaxSuppression(boxes, scores, maxOutputSize, iouThreshold, scoreThreshold) {
        return notYetImplemented('nonMaxSuppression');
    }
    fft(x) {
        return notYetImplemented('fft');
    }
    ifft(x) {
        return notYetImplemented('ifft');
    }
    complex(real, imag) {
        return notYetImplemented('complex');
    }
    real(input) {
        return notYetImplemented('real');
    }
    imag(input) {
        return notYetImplemented('imag');
    }
    cropAndResize(image, boxes, boxIndex, cropSize, method, extrapolationValue) {
        return notYetImplemented('cropAndResize');
    }
    depthToSpace(x, blockSize, dataFormat) {
        return notYetImplemented('depthToSpace');
    }
    // Aligns with the "SplitV" kernel in TensorFlow.
    split(value, sizeSplits, axis) {
        return notYetImplemented('split');
    }
    sparseToDense(sparseIndices, sparseValues, outputShape, defaultValue) {
        return notYetImplemented('sparseToDense');
    }
    diag(x) {
        return notYetImplemented('diag');
    }
    fill(shape, value, dtype) {
        return notYetImplemented('fill');
    }
    onesLike(x) {
        return notYetImplemented('onesLike');
    }
    zerosLike(x) {
        return notYetImplemented('zerosLike');
    }
    linspace(start, stop, num) {
        return notYetImplemented('linspace');
    }
    dispose() {
        return notYetImplemented('dispose');
    }
}
function notYetImplemented(kernelName) {
    throw new Error(`'${kernelName}' not yet implemented or not found in the registry. ` +
        `Did you forget to import the kernel?`);
}

export { DataStorage as D, KernelBackend as K, gather_nd_util as g, prepareAndValidate as p };
