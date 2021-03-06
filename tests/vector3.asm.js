function TurboModule(global, env, buffer) {
    "use asm";
    //##################################
    //#            RUNTIME             #
    //##################################
    var HEAP8 = new global.Int8Array(buffer);
    var HEAP16 = new global.Int16Array(buffer);
    var HEAP32 = new global.Int32Array(buffer);
    var HEAPU8 = new global.Uint8Array(buffer);
    var HEAPU16 = new global.Uint16Array(buffer);
    var HEAPU32 = new global.Uint32Array(buffer);
    var HEAPF32 = new global.Float32Array(buffer);
    var HEAPF64 = new global.Float64Array(buffer);
    
    var NULL = 0;
    var fround = global.Math.fround;
    
    //##################################
    //#            IMPORTS             #
    //##################################
    var Math_abs = global.Math.abs;
    var Math_acos = global.Math.acos;
    var Math_asin = global.Math.asin;
    var Math_atan = global.Math.atan;
    var Math_atan2 = global.Math.atan2;
    var Math_ceil = global.Math.ceil;
    var Math_cos = global.Math.cos;
    var Math_exp = global.Math.exp;
    var Math_floor = global.Math.floor;
    var Math_log = global.Math.log;
    var Math_max = global.Math.max;
    var Math_min = global.Math.min;
    var Math_pow = global.Math.pow;
    var Math_sin = global.Math.sin;
    var Math_sqrt = global.Math.sqrt;
    var Math_tan = global.Math.tan;
    var Math_imul = global.Math.imul;
    
    //##################################
    //#       MEMORY INITIALIZER       #
    //##################################
    function initMemory() {
        HEAPU8[0] = 0; HEAPU8[1] = 0; HEAPU8[2] = 0; HEAPU8[3] = 0; 
        HEAPU8[4] = 0; HEAPU8[5] = 0; HEAPU8[6] = 0; HEAPU8[7] = 0; 
        HEAPU8[8] = 48; HEAPU8[9] = 0; HEAPU8[10] = 0; HEAPU8[11] = 0; 
        HEAPU8[12] = 48; HEAPU8[13] = 0; HEAPU8[14] = 0; HEAPU8[15] = 0; 
        HEAPU8[16] = 0; HEAPU8[17] = 0; HEAPU8[18] = 0; HEAPU8[19] = 0; 
        HEAPU8[20] = 0; HEAPU8[21] = 0; HEAPU8[22] = 0; HEAPU8[23] = 0; 
        HEAPU8[24] = 0; HEAPU8[25] = 0; HEAPU8[26] = 0; HEAPU8[27] = 0; 
        HEAPU8[28] = 0; HEAPU8[29] = 0; HEAPU8[30] = 0; HEAPU8[31] = 0; 
        HEAPU8[32] = 0; HEAPU8[33] = 0; HEAPU8[34] = 0; HEAPU8[35] = 0; 
        HEAPU8[36] = 0; HEAPU8[37] = 0; HEAPU8[38] = 0; HEAPU8[39] = 0; 
    }
    
    //##################################
    //#             CODE               #
    //##################################
    
    function malloc(nbytes) {
        nbytes = nbytes|0;
        var alignment = 8;
        var chunkSize = 0;
        var freeChunk = 0;
        var offset = 0;
        var top = 0;
        var ptr = 0;
        nbytes = ((((((nbytes|0) + ((((alignment|0) - (1|0))|0))|0)|0)|0 & (~(alignment - (1|0)) | 0))|0)|0)|0;
        chunkSize = ((nbytes|0) + (8|0))|0;
        freeChunk = (getFreeChunk((chunkSize|0))|0);
        
        if ((((freeChunk|0) | 0) > (0|0))|0) {
            return (freeChunk)|0;
        }
        
        offset = (HEAP32[(12) >> 2]|0) | 0;
        offset = ((((offset|0) + (7|0))|0)|0)|0;
        offset = ((((offset|0) & (-8|0))|0)|0)|0;
        top = ((offset|0) + (chunkSize|0))|0;
        ptr = ((offset|0) + (4|0))|0;
        setHeadSize((ptr|0), (chunkSize|0));
        setInuse(((ptr|0) + (4|0))|0);
        setFoot((ptr|0), (chunkSize|0));
        HEAP32[(12) >> 2] = ((top|0) + (4|0))|0;
        offset = ((((offset|0) + (8|0))|0)|0)|0;
        ptr = ((offset|0))|0;
        
        while ((((ptr|0) | 0) < ((top|0) | 0))|0) {
            HEAP32[(ptr ) >> 2] = 0;
            ptr = ((((ptr|0) + (4|0))|0)|0)|0;
        }
        return (offset)|0;
    }
    
    
    function free(ptr) {
        ptr = ptr|0;
        var chunkptr = 0;
        var tmp1 = 0;
        chunkptr = 0;
        clearInuse((ptr|0));
        
        if ((((HEAP32[(24) >> 2]|0) == (0|0))|0)) {
            HEAP32[(24) >> 2] = (ptr|0) | 0;
        }
        
        tmp1 = ((HEAP32[(16) >> 2]|0) | 0)|0;
        tmp1 = ((((tmp1|0) + ((getChunkSize((ptr|0))|0) | 0))|0)|0)|0;
        HEAP32[(16) >> 2] = (tmp1|0) | 0;
        chunkptr = ((((ptr|0) + (4|0))|0)|0)|0;
        
        if (((HEAP32[(28) >> 2]|0) > (0|0))|0) {
            HEAP32[(chunkptr ) >> 2] = (HEAP32[(28) >> 2]|0);
            HEAP32[((HEAP32[(28) >> 2]|0) ) >> 2] = (ptr|0) | 0;
        }
        
        else {
            HEAP32[(chunkptr ) >> 2] = 0;
        }
        
        HEAP32[(ptr ) >> 2] = 0;
        HEAP32[(28) >> 2] = (ptr|0) | 0;
        HEAP32[(20) >> 2] = ((HEAP32[(20) >> 2]|0) + (1|0))|0;
    }
    
    
    function getFreeChunk(nbytes) {
        nbytes = nbytes|0;
        var freeChunk = 0;
        var tmp1 = 0;
        var tmp2 = 0;
        var tmp3 = 0;
        var tmp4 = 0;
        freeChunk = 0;
        tmp1 = ((HEAP32[(24) >> 2]|0))|0;
        tmp2 = ((HEAP32[(28) >> 2]|0))|0;
        tmp3 = ((HEAP32[(16) >> 2]|0))|0;
        
        if (((HEAP32[(20) >> 2]|0) > (0|0))|0) {
            freeChunk = ((findChunk((nbytes|0))|0))|0;
            
            if ((((freeChunk|0) | 0) > (0|0))|0) {
                if (((((freeChunk|0) | 0) == (tmp1|0))|0)) {
                    HEAP32[(24) >> 2] = (nextFree((freeChunk|0))|0) | 0;
                }
                
                if (((((freeChunk|0) | 0) == (tmp2|0))|0)) {
                    HEAP32[(28) >> 2] = 0;
                }
                
                HEAP32[(20) >> 2] = ((HEAP32[(20) >> 2]|0) - (1|0))|0;
                setInuse((freeChunk|0));
                tmp4 = ((getChunkSize((freeChunk|0))|0))|0;
                tmp3 = ((((tmp3|0) - (tmp4|0))|0)|0)|0;
                HEAP32[(16) >> 2] = (tmp3|0);
                return (freeChunk)|0;
            }
        }
        return 0;
    }
    
    
    function findChunk(nbytes) {
        nbytes = nbytes|0;
        var chunk = 0;
        var tmp1 = 0;
        chunk = 0;
        chunk = ((HEAP32[(24) >> 2]|0))|0;
        
        while (((chunk|0) != 0)|0) {
            tmp1 = ((getChunkSize((chunk|0))|0))|0;
            
            if ((((tmp1|0) == (nbytes|0))|0)) {
                return (chunk)|0;
            }
            
            chunk = ((HEAP32[(chunk ) >> 2]|0))|0;
        }
        return 0;
    }
    
    
    function getFreeMemory() {
        return ((HEAP32[(16) >> 2]|0))|0;
    }
    
    
    function nextFree(ptr) {
        ptr = ptr|0;
        return ((HEAP32[(ptr ) >> 2]|0) | 0)|0;
    }
    
    
    function setHeadSize(ptr, s) {
        ptr = ptr|0;
        s = s|0;
        HEAP32[(ptr ) >> 2] = ((((HEAP32[(ptr ) >> 2]|0) & (7|0))|0)|0 | (s|0))|0;
    }
    
    
    function setFoot(ptr, s) {
        ptr = ptr|0;
        s = s|0;
        var chunkptr = 0;
        var size = 0;
        size = ((HEAP32[(ptr ) >> 2]|0))|0;
        chunkptr = (((((ptr|0) | 0) + (size|0))|0)|0)|0;
        HEAP32[(chunkptr ) >> 2] = (s|0);
    }
    
    
    function setInuse(ptr) {
        ptr = ptr|0;
        var chunkptr = 0;
        chunkptr = (((((ptr|0) | 0) - (4|0))|0)|0)|0;
        HEAP32[(chunkptr ) >> 2] = ((HEAP32[(chunkptr ) >> 2]|0) | (1|0))|0;
    }
    
    
    function clearInuse(ptr) {
        ptr = ptr|0;
        var chunkptr = 0;
        chunkptr = (((((ptr|0) | 0) - (4|0))|0)|0)|0;
        HEAP32[(chunkptr ) >> 2] = ((HEAP32[(chunkptr ) >> 2]|0) & (-2|0))|0;
    }
    
    
    function getChunkSize(ptr) {
        ptr = ptr|0;
        var chunkptr = 0;
        chunkptr = (((((ptr|0) | 0) - (4|0))|0)|0)|0;
        return ((HEAP32[(chunkptr ) >> 2]|0) & (-2|0))|0;
    }
    
    
    function Array_op_get(ptr, index) {
        ptr = ptr|0;
        index = index|0;
        if (((index|0) < (((HEAP32[(ptr ) >> 2]|0) / (HEAP32[(ptr + (4|0) ) >> 2]|0))|0)|0)|0) {
            return ((HEAP32[((ptr + (8|0))|0 + ((index << (2|0)))|0 ) >> 2]|0))|0;
        }
        return 0;
    }
    
    
    function Array_op_set(ptr, index, value) {
        ptr = ptr|0;
        index = index|0;
        value = value|0;
        HEAP32[((ptr + (8|0))|0 + ((index << (2|0)))|0 ) >> 2] = (value|0);
    }
    
    
    function Array_new(bytesLength, elementSize) {
        bytesLength = bytesLength|0;
        elementSize = elementSize|0;
        var ptr = 0;
        ptr = malloc((8 + bytesLength)|0)|0;
        HEAP32[(ptr ) >> 2] = (bytesLength|0);
        HEAP32[(ptr + (4|0)) >> 2] = (elementSize|0);
        return (ptr)|0;
    }
    
    
    function Array_length(ptr) {
        ptr = ptr|0;
        return (((HEAP32[(ptr ) >> 2]|0) / (HEAP32[(ptr + (4|0) ) >> 2]|0))|0)|0;
    }
    
    
    function Vector3_new(x, y, z) {
        x = fround(x);
        y = fround(y);
        z = fround(z);
        var ptr = 0;
        ptr = malloc(12)|0;
        HEAPF32[(ptr ) >> 2] = fround(x);
        HEAPF32[(ptr + (4|0)) >> 2] = fround(y);
        HEAPF32[(ptr + (8|0)) >> 2] = fround(z);
        return (ptr)|0;
    }
    
    
    function Vector3_length(ptr) {
        ptr = ptr|0;
        return fround(Math_sqrt(fround(fround(fround(fround(fround(HEAPF32[(ptr ) >> 2]) * fround(HEAPF32[(ptr ) >> 2])) + fround(fround(HEAPF32[(ptr + (4|0) ) >> 2]) * fround(HEAPF32[(ptr + (4|0) ) >> 2])))) + fround(fround(HEAPF32[(ptr + (8|0) ) >> 2]) * fround(HEAPF32[(ptr + (8|0) ) >> 2])))));
    }
    
    
    function Vector3_lengthN(ptr, n) {
        ptr = ptr|0;
        n = fround(n);
        var a = 0;
        var p1 = 0.0;
        var p2 = 0.0;
        var p3 = 0.0;
        var xyz = 0.0;
        var length = fround(0);
        if (((fround(n) == fround(2))|0)) {
            return fround(Vector3_length(ptr));
        }
        
        a = (Vector3_abs()|0);
        p1 = (+Math_pow(fround(HEAPF32[(a ) >> 2]), (+n)));
        p2 = (+Math_pow(fround(HEAPF32[(a + (4|0) ) >> 2]), (+n)));
        p3 = (+Math_pow(fround(HEAPF32[(a + (8|0) ) >> 2]), (+n)));
        xyz = +(+(+((+p1) + (+p2))) + (+p3));
        length = fround((+Math_pow((+xyz), +(1.0 / (+n)))));
        free((a)|0);
        return fround(length);
    }
    
    
    function Vector3_dot(ptr, b) {
        ptr = ptr|0;
        b = b|0;
        return fround(fround(fround(fround(HEAPF32[(ptr ) >> 2]) * fround(HEAPF32[(b ) >> 2])) + fround(fround(HEAPF32[(ptr + (4|0) ) >> 2]) * fround(HEAPF32[(b + (4|0) ) >> 2]))) + fround(fround(HEAPF32[(ptr + (8|0) ) >> 2]) * fround(HEAPF32[(b + (8|0) ) >> 2])));
    }
    
    
    function Vector3_cross(ptr, b) {
        ptr = ptr|0;
        b = b|0;
        return Vector3_new((fround(fround(fround(HEAPF32[(ptr + (4|0) ) >> 2]) * fround(HEAPF32[(b + (8|0) ) >> 2])) - fround(fround(HEAPF32[(ptr + (8|0) ) >> 2]) * fround(HEAPF32[(b + (4|0) ) >> 2])))), (fround(fround(fround(HEAPF32[(ptr + (8|0) ) >> 2]) * fround(HEAPF32[(b ) >> 2])) - fround(fround(HEAPF32[(ptr ) >> 2]) * fround(HEAPF32[(b + (8|0) ) >> 2])))), (fround(fround(fround(HEAPF32[(ptr ) >> 2]) * fround(HEAPF32[(b + (4|0) ) >> 2])) - fround(fround(HEAPF32[(ptr + (4|0) ) >> 2]) * fround(HEAPF32[(b ) >> 2])))))|0;
    }
    
    
    function Vector3_normalize(ptr) {
        ptr = ptr|0;
        var d = fround(0);
        d = fround(Vector3_length());
        return Vector3_new((fround(fround(HEAPF32[(ptr ) >> 2]) / fround(d))), (fround(fround(HEAPF32[(ptr + (4|0) ) >> 2]) / fround(d))), (fround(fround(HEAPF32[(ptr + (8|0) ) >> 2]) / fround(d))))|0;
    }
    
    
    function Vector3_negate(ptr) {
        ptr = ptr|0;
        return Vector3_new((-fround(HEAPF32[(ptr ) >> 2])), (-fround(HEAPF32[(ptr + (4|0) ) >> 2])), (-fround(HEAPF32[(ptr + (8|0) ) >> 2])))|0;
    }
    
    
    function Vector3_abs(ptr) {
        ptr = ptr|0;
        return Vector3_new(fround(Math_abs(fround(HEAPF32[(ptr ) >> 2]))), fround(Math_abs(fround(HEAPF32[(ptr + (4|0) ) >> 2]))), fround(Math_abs(fround(HEAPF32[(ptr + (8|0) ) >> 2]))))|0;
    }
    
    
    function Vector3_add(ptr, b) {
        ptr = ptr|0;
        b = b|0;
        return Vector3_new((fround(fround(HEAPF32[(ptr ) >> 2]) + fround(HEAPF32[(b ) >> 2]))), (fround(fround(HEAPF32[(ptr + (4|0) ) >> 2]) + fround(HEAPF32[(b + (4|0) ) >> 2]))), (fround(fround(HEAPF32[(ptr + (8|0) ) >> 2]) + fround(HEAPF32[(b + (8|0) ) >> 2]))))|0;
    }
    
    
    function Vector3_sub(ptr, b) {
        ptr = ptr|0;
        b = b|0;
        return Vector3_new((fround(fround(HEAPF32[(ptr ) >> 2]) - fround(HEAPF32[(b ) >> 2]))), (fround(fround(HEAPF32[(ptr + (4|0) ) >> 2]) - fround(HEAPF32[(b + (4|0) ) >> 2]))), (fround(fround(HEAPF32[(ptr + (8|0) ) >> 2]) - fround(HEAPF32[(b + (8|0) ) >> 2]))))|0;
    }
    
    
    function Vector3_mul(ptr, b) {
        ptr = ptr|0;
        b = b|0;
        return Vector3_new(fround(HEAPF32[(ptr ) >> 2]) * fround(HEAPF32[(b ) >> 2]), fround(HEAPF32[(ptr + (4|0) ) >> 2]) * fround(HEAPF32[(b + (4|0) ) >> 2]), fround(HEAPF32[(ptr + (8|0) ) >> 2]) * fround(HEAPF32[(b + (8|0) ) >> 2]))|0;
    }
    
    
    function Vector3_div(ptr, b) {
        ptr = ptr|0;
        b = b|0;
        return Vector3_new((fround(fround(HEAPF32[(ptr ) >> 2]) / fround(HEAPF32[(b ) >> 2]))), (fround(fround(HEAPF32[(ptr + (4|0) ) >> 2]) / fround(HEAPF32[(b + (4|0) ) >> 2]))), (fround(fround(HEAPF32[(ptr + (8|0) ) >> 2]) / fround(HEAPF32[(b + (8|0) ) >> 2]))))|0;
    }
    
    
    function Vector3_mod(ptr, b) {
        ptr = ptr|0;
        b = b|0;
        return Vector3_new((fround(fround(HEAPF32[(ptr ) >> 2]) - fround(fround(HEAPF32[(b ) >> 2]) * fround(Math_floor(fround(fround(HEAPF32[(ptr ) >> 2]) / fround(HEAPF32[(b ) >> 2]))))))), (fround(fround(HEAPF32[(ptr + (4|0) ) >> 2]) - fround(fround(HEAPF32[(b + (4|0) ) >> 2]) * fround(Math_floor(fround(fround(HEAPF32[(ptr + (4|0) ) >> 2]) / fround(HEAPF32[(b + (4|0) ) >> 2]))))))), (fround(fround(HEAPF32[(ptr + (8|0) ) >> 2]) - fround(fround(HEAPF32[(b + (8|0) ) >> 2]) * fround(Math_floor(fround(fround(HEAPF32[(ptr + (8|0) ) >> 2]) / fround(HEAPF32[(b + (8|0) ) >> 2]))))))))|0;
    }
    
    
    function Vector3_addScalar(ptr, f) {
        ptr = ptr|0;
        f = fround(f);
        return Vector3_new((fround(fround(HEAPF32[(ptr ) >> 2]) + fround(f))), (fround(fround(HEAPF32[(ptr + (4|0) ) >> 2]) + fround(f))), (fround(fround(HEAPF32[(ptr + (8|0) ) >> 2]) + fround(f))))|0;
    }
    
    
    function Vector3_subScalar(ptr, f) {
        ptr = ptr|0;
        f = fround(f);
        return Vector3_new((fround(fround(HEAPF32[(ptr ) >> 2]) - fround(f))), (fround(fround(HEAPF32[(ptr + (4|0) ) >> 2]) - fround(f))), (fround(fround(HEAPF32[(ptr + (8|0) ) >> 2]) - fround(f))))|0;
    }
    
    
    function Vector3_mulScalar(ptr, f) {
        ptr = ptr|0;
        f = fround(f);
        return Vector3_new(fround(HEAPF32[(ptr ) >> 2]) * f, fround(HEAPF32[(ptr + (4|0) ) >> 2]) * f, fround(HEAPF32[(ptr + (8|0) ) >> 2]) * f)|0;
    }
    
    
    function Vector3_divScalar(ptr, f) {
        ptr = ptr|0;
        f = fround(f);
        return Vector3_new((fround(fround(HEAPF32[(ptr ) >> 2]) / fround(f))), (fround(fround(HEAPF32[(ptr + (4|0) ) >> 2]) / fround(f))), (fround(fround(HEAPF32[(ptr + (8|0) ) >> 2]) / fround(f))))|0;
    }
    
    
    function Vector3_min(ptr, b) {
        ptr = ptr|0;
        b = b|0;
        return Vector3_new(fround((+Math_min(fround(HEAPF32[(ptr ) >> 2]), fround(HEAPF32[(b ) >> 2])))), fround((+Math_min(fround(HEAPF32[(ptr + (4|0) ) >> 2]), fround(HEAPF32[(b + (4|0) ) >> 2])))), fround((+Math_min(fround(HEAPF32[(ptr + (8|0) ) >> 2]), fround(HEAPF32[(b + (8|0) ) >> 2])))))|0;
    }
    
    
    function Vector3_max(ptr, b) {
        ptr = ptr|0;
        b = b|0;
        return Vector3_new(fround((+Math_max(fround(HEAPF32[(ptr ) >> 2]), fround(HEAPF32[(b ) >> 2])))), fround((+Math_max(fround(HEAPF32[(ptr + (4|0) ) >> 2]), fround(HEAPF32[(b + (4|0) ) >> 2])))), fround((+Math_max(fround(HEAPF32[(ptr + (8|0) ) >> 2]), fround(HEAPF32[(b + (8|0) ) >> 2])))))|0;
    }
    
    
    function Vector3_minAxis(ptr, a) {
        ptr = ptr|0;
        a = a|0;
        var x = fround(0);
        var y = fround(0);
        var z = fround(0);
        x = fround(Math_abs(fround(HEAPF32[(ptr ) >> 2])));
        y = fround(Math_abs(fround(HEAPF32[(ptr + (4|0) ) >> 2])));
        z = fround(Math_abs(fround(HEAPF32[(ptr + (8|0) ) >> 2])));
        
        if (((((fround(x) <= fround(y))|0)|0 & ((fround(x) <= fround(z))|0)|0)|0)) {
            return Vector3_new((fround(1)), (fround(0)), (fround(0)))|0;
        }
        
        else if (((((fround(y) <= fround(x))|0)|0 & ((fround(y) <= fround(z))|0)|0)|0)) {
            return Vector3_new((fround(0)), (fround(1)), (fround(0)))|0;
        }
        return Vector3_new((fround(0)), (fround(0)), (fround(1)))|0;
    }
    
    
    function Vector3_minComponent(ptr, a) {
        ptr = ptr|0;
        a = a|0;
        return fround(fround((+Math_min((+Math_min(fround(HEAPF32[(ptr ) >> 2]), fround(HEAPF32[(ptr + (4|0) ) >> 2]))), fround(HEAPF32[(ptr + (8|0) ) >> 2])))));
    }
    
    
    function Vector3_maxComponent(ptr, a) {
        ptr = ptr|0;
        a = a|0;
        return fround(fround((+Math_max((+Math_max(fround(HEAPF32[(ptr ) >> 2]), fround(HEAPF32[(ptr + (4|0) ) >> 2]))), fround(HEAPF32[(ptr + (8|0) ) >> 2])))));
    }
    
    
    function Vector3_reflect(ptr, b) {
        ptr = ptr|0;
        b = b|0;
        var tmp1 = 0;
        var tmp2 = 0;
        tmp1 = (Vector3_mulScalar(fround(2) * fround(Vector3_dot((b|0))))|0);
        tmp2 = (Vector3_sub((tmp1|0))|0);
        free((tmp1)|0);
        return (tmp2)|0;
    }
    
    
    function Vector3_refract(ptr, b, n1, n2) {
        ptr = ptr|0;
        b = b|0;
        n1 = fround(n1);
        n2 = fround(n2);
        var nr = fround(0);
        var cosI = fround(0);
        var sinT2 = fround(0);
        var cosT = fround(0);
        var tmp1 = 0;
        var tmp2 = 0;
        var tmp3 = 0;
        nr = fround(fround(n1) / fround(n2));
        cosI = -fround(Vector3_dot(ptr , (b|0)));
        sinT2 = fround(nr * nr) * fround((fround(1) - fround(cosI * cosI)));
        
        if ((fround(sinT2) > fround(1))|0) {
            return Vector3_new((fround(0)), (fround(0)), (fround(0)))|0;
        }
        
        cosT = fround(Math_sqrt(fround(fround(1) - fround(sinT2))));
        tmp1 = (Vector3_mulScalar(fround(nr))|0);
        tmp2 = (Vector3_mulScalar(nr * fround((cosI - cosT)))|0);
        tmp3 = (Vector3_add((tmp2|0))|0);
        free((tmp1)|0);
        free((tmp2)|0);
        return (tmp3)|0;
    }
    
    
    function Vector3_reflectance(ptr, b, n1, n2) {
        ptr = ptr|0;
        b = b|0;
        n1 = fround(n1);
        n2 = fround(n2);
        var nr = fround(0);
        var cosI = fround(0);
        var sinT2 = fround(0);
        var cosT = fround(0);
        var rOrth = fround(0);
        var rPar = fround(0);
        nr = fround(fround(n1) / fround(n2));
        cosI = -fround(Vector3_dot(ptr , (b|0)));
        sinT2 = fround(nr * nr) * fround((fround(1) - fround(cosI * cosI)));
        
        if ((fround(sinT2) > fround(1))|0) {
            return fround(fround(1));
        }
        
        cosT = fround(Math_sqrt(fround(fround(1) - fround(sinT2))));
        rOrth = fround(fround((fround(fround(n1 * cosI) - fround(n2 * cosT)))) / fround((fround(fround(n1 * cosI) + fround(n2 * cosT)))));
        rPar = fround(fround((fround(fround(n2 * cosI) - fround(n1 * cosT)))) / fround((fround(fround(n2 * cosI) + fround(n1 * cosT)))));
        return fround(fround(fround((fround(fround(rOrth * rOrth) + fround(rPar * rPar)))) / fround(2)));
    }
    
    
    function Vector3_pow(ptr, f) {
        ptr = ptr|0;
        f = fround(f);
        return Vector3_new(fround((+Math_pow(fround(HEAPF32[(ptr ) >> 2]), (+f)))), fround((+Math_pow(fround(HEAPF32[(ptr + (4|0) ) >> 2]), (+f)))), fround((+Math_pow(fround(HEAPF32[(ptr + (8|0) ) >> 2]), (+f)))))|0;
    }
    
    
    function Vector3_isEqual(ptr, b) {
        ptr = ptr|0;
        b = b|0;
        return ((((fround(HEAPF32[(ptr ) >> 2]) == fround(HEAPF32[(b ) >> 2]))|0)|0 & ((fround(HEAPF32[(ptr + (4|0) ) >> 2]) == fround(HEAPF32[(b + (4|0) ) >> 2]))|0)|0)|0 & ((fround(HEAPF32[(ptr + (8|0) ) >> 2]) == fround(HEAPF32[(b + (8|0) ) >> 2]))|0)|0)|0;
    }
    
    
    function Vector3_isZero(ptr) {
        ptr = ptr|0;
        var r = 0;
        r = (((((fround(HEAPF32[(ptr ) >> 2]) == fround(0))|0)|0 & ((fround(HEAPF32[(ptr + (4|0) ) >> 2]) == fround(0))|0)|0)|0)|0 & ((fround(HEAPF32[(ptr + (8|0) ) >> 2]) == fround(0))|0)|0)|0;
        return (r)|0;
    }
    
    
    function Vector3_set(ptr, x, y, z) {
        ptr = ptr|0;
        x = fround(x);
        y = fround(y);
        z = fround(z);
        HEAPF32[(ptr ) >> 2] = fround(x);
        HEAPF32[(ptr + (4|0)) >> 2] = fround(y);
        HEAPF32[(ptr + (8|0)) >> 2] = fround(z);
        return (ptr)|0;
    }
    
    
    function Vector3_setFromVector3(ptr, d) {
        ptr = ptr|0;
        d = d|0;
        HEAPF32[(ptr ) >> 2] = fround(HEAPF32[(d ) >> 2]);
        HEAPF32[(ptr + (4|0)) >> 2] = fround(HEAPF32[(d + (4|0) ) >> 2]);
        HEAPF32[(ptr + (8|0)) >> 2] = fround(HEAPF32[(d + (8|0) ) >> 2]);
        return (ptr)|0;
    }
    
    
    function Vector3_copy(ptr, src) {
        ptr = ptr|0;
        src = src|0;
        return (Vector3_set(ptr , fround(HEAPF32[(src ) >> 2]), fround(HEAPF32[(src + (4|0) ) >> 2]), fround(HEAPF32[(src + (8|0) ) >> 2]))|0);
    }
    
    
    function Vector3_clone(ptr) {
        ptr = ptr|0;
        return Vector3_new(fround(HEAPF32[(ptr ) >> 2]), fround(HEAPF32[(ptr + (4|0) ) >> 2]), fround(HEAPF32[(ptr + (8|0) ) >> 2]))|0;
    }
    
    
    
    return {
       initMemory:initMemory,
       malloc:malloc,
       free:free,
       getFreeMemory:getFreeMemory,
       Array_op_get:Array_op_get,
       Array_op_set:Array_op_set,
       Array_new:Array_new,
       Array_length:Array_length,
       Vector3_new:Vector3_new,
       Vector3_length:Vector3_length,
       Vector3_lengthN:Vector3_lengthN,
       Vector3_dot:Vector3_dot,
       Vector3_cross:Vector3_cross,
       Vector3_normalize:Vector3_normalize,
       Vector3_negate:Vector3_negate,
       Vector3_abs:Vector3_abs,
       Vector3_add:Vector3_add,
       Vector3_sub:Vector3_sub,
       Vector3_mul:Vector3_mul,
       Vector3_div:Vector3_div,
       Vector3_mod:Vector3_mod,
       Vector3_addScalar:Vector3_addScalar,
       Vector3_subScalar:Vector3_subScalar,
       Vector3_mulScalar:Vector3_mulScalar,
       Vector3_divScalar:Vector3_divScalar,
       Vector3_min:Vector3_min,
       Vector3_max:Vector3_max,
       Vector3_minAxis:Vector3_minAxis,
       Vector3_minComponent:Vector3_minComponent,
       Vector3_maxComponent:Vector3_maxComponent,
       Vector3_reflect:Vector3_reflect,
       Vector3_refract:Vector3_refract,
       Vector3_reflectance:Vector3_reflectance,
       Vector3_pow:Vector3_pow,
       Vector3_isEqual:Vector3_isEqual,
       Vector3_isZero:Vector3_isZero,
       Vector3_set:Vector3_set,
       Vector3_setFromVector3:Vector3_setFromVector3,
       Vector3_copy:Vector3_copy,
       Vector3_clone:Vector3_clone
    }
}
function TurboWrapper(exports, buffer) {

    exports.initMemory();

    return {
        exports: exports,
        RAW_MEMORY: buffer,

        getMemoryUsage: function () {
            const top = Atomics.load(HEAP32, 2);
            // top -= freeMemory;
            return Math.fround(top / (1024 * 1024));
        },
        HEAP8: new Int8Array(buffer),
        HEAP16: new Int16Array(buffer),
        HEAP32: new Int32Array(buffer),
        HEAPU8: new Uint8Array(buffer),
        HEAPU16: new Uint16Array(buffer),
        HEAPU32: new Uint32Array(buffer),
        HEAPF32: new Float32Array(buffer),
        HEAPF64: new Float64Array(buffer)

    }
}
function initTurbo(bytes) {
    var buffer = new ArrayBuffer(bytes);

    if (buffer.byteLength < 16) {
        throw new Error("The memory is too small even for metadata");
    }

    return TurboWrapper(TurboModule(
        typeof global !== 'undefined' ? global : window,
        typeof env !== 'undefined' ? env : {},
        buffer
    ), buffer);
}
