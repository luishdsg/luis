! function() {
    function t() {
        var r = window.mobileAndTabletCheck();
        if (!r) {
            let n = document.querySelector(".light-splatter");
            document.querySelector("body"), eF();
            let i = {
                SIM_RESOLUTION: 256,
                DYE_RESOLUTION: 1024,
                CAPTURE_RESOLUTION: 512,
                DENSITY_DISSIPATION: 3,
                VELOCITY_DISSIPATION: 4,
                PRESSURE: .1,
                PRESSURE_ITERATIONS: 2,
                CURL: 3,
                SPLAT_RADIUS: 1.5,
                SPLAT_FORCE: 5e4,
                SHADING: !0,
                COLORFUL: !1,
                COLOR_UPDATE_SPEED: 11,
                PAUSED: !1,
                BACK_COLOR: {
                    r: 0,
                    g: 0,
                    b: 0
                },
                TRANSPARENT: !1,
                BLOOM: !0,
                BLOOM_ITERATIONS: 6,
                BLOOM_RESOLUTION: 256,
                BLOOM_INTENSITY: !1,
                BLOOM_THRESHOLD: .3,
                BLOOM_SOFT_KNEE: .4
            };

            function o() {
                this.id = -1, this.texcoordX = 0, this.texcoordY = 0, this.prevTexcoordX = 0, this.prevTexcoordY = 0, this.deltaX = 0, this.deltaY = 0, this.down = !1, this.moved = !1, this.color = [30, 0, 300]
            }
            let a = [],
                u = [],
                l = [];
            a.push(new o);
            let v, f, c, m, s, h, T, d, E, {
                gl: g,
                ext: R
            } = (q = n, v = {
                alpha: !0,
                depth: !1,
                stencil: !1,
                antialias: !1,
                preserveDrawingBuffer: !1
            }, f = q.getContext("webgl2", v), c = !!f, c || (f = q.getContext("webgl", v) || q.getContext("experimental-webgl", v)), c ? (f.getExtension("EXT_color_buffer_float"), s = f.getExtension("OES_texture_float_linear")) : (m = f.getExtension("OES_texture_half_float"), s = f.getExtension("OES_texture_half_float_linear")), f.clearColor(0, 0, 0, 1), h = c ? f.HALF_FLOAT : m.HALF_FLOAT_OES, c ? (T = x(f, f.RGBA16F, f.RGBA, h), d = x(f, f.RG16F, f.RG, h), E = x(f, f.R16F, f.RED, h)) : (T = x(f, f.RGBA, f.RGBA, h), d = x(f, f.RGBA, f.RGBA, h), E = x(f, f.RGBA, f.RGBA, h)), {
                gl: f,
                ext: {
                    formatRGBA: T,
                    formatRG: d,
                    formatR: E,
                    halfFloatTexType: h,
                    supportLinearFiltering: s
                }
            });

            function x(t, r, n, i) {
                var o, a, u, l;
                let v, f;
                if (o = t, a = r, u = n, l = i, v = o.createTexture(), o.bindTexture(o.TEXTURE_2D, v), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MIN_FILTER, o.NEAREST), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_MAG_FILTER, o.NEAREST), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_S, o.CLAMP_TO_EDGE), o.texParameteri(o.TEXTURE_2D, o.TEXTURE_WRAP_T, o.CLAMP_TO_EDGE), o.texImage2D(o.TEXTURE_2D, 0, a, 4, 4, 0, u, l, null), f = o.createFramebuffer(), o.bindFramebuffer(o.FRAMEBUFFER, f), o.framebufferTexture2D(o.FRAMEBUFFER, o.COLOR_ATTACHMENT0, o.TEXTURE_2D, v, 0), o.checkFramebufferStatus(o.FRAMEBUFFER) != o.FRAMEBUFFER_COMPLETE) switch (r) {
                    case t.R16F:
                        return x(t, t.RG16F, t.RG, i);
                    case t.RG16F:
                        return x(t, t.RGBA16F, t.RGBA, i);
                    default:
                        return null
                }
                return {
                    internalFormat: r,
                    format: n
                }
            }

            function r() {
                return /Mobi|Android/i.test(navigator.userAgent)
            }

            function p(t) {
                g.bindFramebuffer(g.FRAMEBUFFER, t.fbo);
                let r = t.width * t.height * 4,
                    n = new Float32Array(r);
                return g.readPixels(0, 0, t.width, t.height, g.RGBA, g.FLOAT, n), n
            }

            function $(t, r, n) {
                let i = new Uint8Array(t.length),
                    o = 0;
                for (let a = n - 1; a >= 0; a--)
                    for (let u = 0; u < r; u++) {
                        let l = a * r * 4 + 4 * u;
                        i[l + 0] = 255 * D(t[o + 0]), i[l + 1] = 255 * D(t[o + 1]), i[l + 2] = 255 * D(t[o + 2]), i[l + 3] = 255 * D(t[o + 3]), o += 4
                    }
                return i
            }

            function D(t) {
                return Math.min(Math.max(t, 0), 1)
            }

            function S(t, r, n) {
                let i = document.createElement("canvas"),
                    o = i.getContext("2d");
                i.width = r, i.height = n;
                let a = o.createImageData(r, n);
                return a.data.set(t), o.putImageData(a, 0, 0), i
            }
            r() && (i.DYE_RESOLUTION = 512), R.supportLinearFiltering || (i.DYE_RESOLUTION = 512, i.SHADING = !1, i.BLOOM = !1);
            class A {
                constructor(t, r) {
                    if (this.uniforms = {}, this.program = g.createProgram(), g.attachShader(this.program, t), g.attachShader(this.program, r), g.linkProgram(this.program), !g.getProgramParameter(this.program, g.LINK_STATUS)) throw g.getProgramInfoLog(this.program);
                    let n = g.getProgramParameter(this.program, g.ACTIVE_UNIFORMS);
                    for (let i = 0; i < n; i++) {
                        let o = g.getActiveUniform(this.program, i).name;
                        this.uniforms[o] = g.getUniformLocation(this.program, o)
                    }
                }
                bind() {
                    g.useProgram(this.program)
                }
            }

            function _(t, r, n) {
                if (null != n) {
                    let i = "";
                    n.forEach(t => {
                        i += "#define " + t + "\n"
                    }), r = i + r
                }
                let o = g.createShader(t);
                if (g.shaderSource(o, r), g.compileShader(o), !g.getShaderParameter(o, g.COMPILE_STATUS)) throw g.getShaderInfoLog(o);
                return o
            }
            let L = _(g.VERTEX_SHADER, "\n    precision highp float;\n\n    attribute vec2 aPosition;\n    varying vec2 vUv;\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform vec2 texelSize;\n\n    void main () {\n        vUv = aPosition * 0.5 + 0.5;\n        vL = vUv - vec2(texelSize.x, 0.0);\n        vR = vUv + vec2(texelSize.x, 0.0);\n        vT = vUv + vec2(0.0, texelSize.y);\n        vB = vUv - vec2(0.0, texelSize.y);\n        gl_Position = vec4(aPosition, 0.0, 1.0);\n    }\n"),
                F = _(g.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    uniform sampler2D uTexture;\n\n    void main () {\n        gl_FragColor = texture2D(uTexture, vUv);\n    }\n"),
                U = _(g.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    uniform sampler2D uTexture;\n    uniform float value;\n\n    void main () {\n        gl_FragColor = value * texture2D(uTexture, vUv);\n    }\n"),
                b = _(g.FRAGMENT_SHADER, "\n    precision mediump float;\n\n    uniform vec4 color;\n\n    void main () {\n        gl_FragColor = color;\n    }\n"),
                w = _(g.FRAGMENT_SHADER, "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uTexture;\n    uniform float aspectRatio;\n\n    #define SCALE 25.0\n\n    void main () {\n        vec2 uv = floor(vUv * SCALE * vec2(aspectRatio, 1.0));\n        float v = mod(uv.x + uv.y, 2.0);\n        v = v * 0.1 + 0.8;\n        gl_FragColor = vec4(vec3(v), 1.0);\n    }\n"),
                y = "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform sampler2D uTexture;\n    uniform sampler2D uBloom;\n    uniform sampler2D uDithering;\n    uniform vec2 ditherScale;\n    uniform vec2 texelSize;\n\n    vec3 linearToGamma (vec3 color) {\n        color = max(color, vec3(0));\n        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));\n    }\n\n    void main () {\n        vec3 c = texture2D(uTexture, vUv).rgb;\n\n    #ifdef SHADING\n        vec3 lc = texture2D(uTexture, vL).rgb;\n        vec3 rc = texture2D(uTexture, vR).rgb;\n        vec3 tc = texture2D(uTexture, vT).rgb;\n        vec3 bc = texture2D(uTexture, vB).rgb;\n\n        float dx = length(rc) - length(lc);\n        float dy = length(tc) - length(bc);\n\n        vec3 n = normalize(vec3(dx, dy, length(texelSize)));\n        vec3 l = vec3(0.0, 0.0, 1.0);\n\n        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);\n        c *= diffuse;\n    #endif\n\n    #ifdef BLOOM\n        vec3 bloom = texture2D(uBloom, vUv).rgb;\n        float noise = texture2D(uDithering, vUv * ditherScale).r;\n        noise = noise * 2.0 - 1.0;\n        bloom += noise / 255.0;\n        bloom = linearToGamma(bloom);\n        c += bloom;\n    #endif\n\n        float a = max(c.r, max(c.g, c.b));\n        gl_FragColor = vec4(c, a);\n    }\n",
                O = _(g.FRAGMENT_SHADER, y),
                B = _(g.FRAGMENT_SHADER, y, ["BLOOM"]),
                N = _(g.FRAGMENT_SHADER, y, ["SHADING"]),
                I = _(g.FRAGMENT_SHADER, y, ["BLOOM", "SHADING"]),
                P = _(g.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uTexture;\n    uniform vec3 curve;\n    uniform float threshold;\n\n    void main () {\n        vec3 c = texture2D(uTexture, vUv).rgb;\n        float br = max(c.r, max(c.g, c.b));\n        float rq = clamp(br - curve.x, 0.0, curve.y);\n        rq = curve.z * rq * rq;\n        c *= max(rq, br - threshold) / max(br, 0.0001);\n        gl_FragColor = vec4(c, 0.0);\n    }\n"),
                M = _(g.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform sampler2D uTexture;\n\n    void main () {\n        vec4 sum = vec4(0.0);\n        sum += texture2D(uTexture, vL);\n        sum += texture2D(uTexture, vR);\n        sum += texture2D(uTexture, vT);\n        sum += texture2D(uTexture, vB);\n        sum *= 0.25;\n        gl_FragColor = sum;\n    }\n"),
                X = _(g.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform sampler2D uTexture;\n    uniform float intensity;\n\n    void main () {\n        vec4 sum = vec4(0.0);\n        sum += texture2D(uTexture, vL);\n        sum += texture2D(uTexture, vR);\n        sum += texture2D(uTexture, vT);\n        sum += texture2D(uTexture, vB);\n        sum *= 0.25;\n        gl_FragColor = sum * intensity;\n    }\n"),
                C = _(g.FRAGMENT_SHADER, "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uTarget;\n    uniform float aspectRatio;\n    uniform vec3 color;\n    uniform vec2 point;\n    uniform float radius;\n\n    void main () {\n        vec2 p = vUv - point.xy;\n        p.x *= aspectRatio;\n        vec3 splat = exp(-dot(p, p) / radius) * color;\n        vec3 base = texture2D(uTarget, vUv).xyz;\n        gl_FragColor = vec4(base + splat, 1.0);\n    }\n"),
                G = _(g.FRAGMENT_SHADER, "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    uniform sampler2D uVelocity;\n    uniform sampler2D uSource;\n    uniform vec2 texelSize;\n    uniform vec2 dyeTexelSize;\n    uniform float dt;\n    uniform float dissipation;\n\n    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {\n        vec2 st = uv / tsize - 0.5;\n\n        vec2 iuv = floor(st);\n        vec2 fuv = fract(st);\n\n        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);\n        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);\n        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);\n        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);\n\n        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);\n    }\n\n    void main () {\n    #ifdef MANUAL_FILTERING\n        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;\n        vec4 result = bilerp(uSource, coord, dyeTexelSize);\n    #else\n        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;\n        vec4 result = texture2D(uSource, coord);\n    #endif\n        float decay = 1.0 + dissipation * dt;\n        gl_FragColor = result / decay;\n    }", R.supportLinearFiltering ? null : ["MANUAL_FILTERING"]),
                z = _(g.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    varying highp vec2 vL;\n    varying highp vec2 vR;\n    varying highp vec2 vT;\n    varying highp vec2 vB;\n    uniform sampler2D uVelocity;\n\n    void main () {\n        float L = texture2D(uVelocity, vL).x;\n        float R = texture2D(uVelocity, vR).x;\n        float T = texture2D(uVelocity, vT).y;\n        float B = texture2D(uVelocity, vB).y;\n\n        vec2 C = texture2D(uVelocity, vUv).xy;\n        if (vL.x < 0.0) { L = -C.x; }\n        if (vR.x > 1.0) { R = -C.x; }\n        if (vT.y > 1.0) { T = -C.y; }\n        if (vB.y < 0.0) { B = -C.y; }\n\n        float div = 0.5 * (R - L + T - B);\n        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);\n    }\n"),
                Y = _(g.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    varying highp vec2 vL;\n    varying highp vec2 vR;\n    varying highp vec2 vT;\n    varying highp vec2 vB;\n    uniform sampler2D uVelocity;\n\n    void main () {\n        float L = texture2D(uVelocity, vL).y;\n        float R = texture2D(uVelocity, vR).y;\n        float T = texture2D(uVelocity, vT).x;\n        float B = texture2D(uVelocity, vB).x;\n        float vorticity = R - L - T + B;\n        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);\n    }\n"),
                H = _(g.FRAGMENT_SHADER, "\n    precision highp float;\n    precision highp sampler2D;\n\n    varying vec2 vUv;\n    varying vec2 vL;\n    varying vec2 vR;\n    varying vec2 vT;\n    varying vec2 vB;\n    uniform sampler2D uVelocity;\n    uniform sampler2D uCurl;\n    uniform float curl;\n    uniform float dt;\n\n    void main () {\n        float L = texture2D(uCurl, vL).x;\n        float R = texture2D(uCurl, vR).x;\n        float T = texture2D(uCurl, vT).x;\n        float B = texture2D(uCurl, vB).x;\n        float C = texture2D(uCurl, vUv).x;\n\n        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));\n        force /= length(force) + 0.0001;\n        force *= curl * C;\n        force.y *= -1.0;\n\n        vec2 vel = texture2D(uVelocity, vUv).xy;\n        gl_FragColor = vec4(vel + force * dt, 0.0, 1.0);\n    }\n"),
                V = _(g.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    varying highp vec2 vL;\n    varying highp vec2 vR;\n    varying highp vec2 vT;\n    varying highp vec2 vB;\n    uniform sampler2D uPressure;\n    uniform sampler2D uDivergence;\n\n    void main () {\n        float L = texture2D(uPressure, vL).x;\n        float R = texture2D(uPressure, vR).x;\n        float T = texture2D(uPressure, vT).x;\n        float B = texture2D(uPressure, vB).x;\n        float C = texture2D(uPressure, vUv).x;\n        float divergence = texture2D(uDivergence, vUv).x;\n        float pressure = (L + R + B + T - divergence) * 0.25;\n        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);\n    }\n"),
                W = _(g.FRAGMENT_SHADER, "\n    precision mediump float;\n    precision mediump sampler2D;\n\n    varying highp vec2 vUv;\n    varying highp vec2 vL;\n    varying highp vec2 vR;\n    varying highp vec2 vT;\n    varying highp vec2 vB;\n    uniform sampler2D uPressure;\n    uniform sampler2D uVelocity;\n\n    void main () {\n        float L = texture2D(uPressure, vL).x;\n        float R = texture2D(uPressure, vR).x;\n        float T = texture2D(uPressure, vT).x;\n        float B = texture2D(uPressure, vB).x;\n        vec2 velocity = texture2D(uVelocity, vUv).xy;\n        velocity.xy -= vec2(R - L, T - B);\n        gl_FragColor = vec4(velocity, 0.0, 1.0);\n    }\n"),
                k = (g.bindBuffer(g.ARRAY_BUFFER, g.createBuffer()), g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), g.STATIC_DRAW), g.bindBuffer(g.ELEMENT_ARRAY_BUFFER, g.createBuffer()), g.bufferData(g.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), g.STATIC_DRAW), g.vertexAttribPointer(0, 2, g.FLOAT, !1, 0, 0), g.enableVertexAttribArray(0), t => {
                    g.bindFramebuffer(g.FRAMEBUFFER, t), g.drawElements(g.TRIANGLES, 6, g.UNSIGNED_SHORT, 0)
                });
            var q, K = "https://dezea.digital/LDR_LLL1_0.png";
            let j, J, Q, Z, ee, et, er, en, ei, eo = (j = g.createTexture(), g.bindTexture(g.TEXTURE_2D, j), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.REPEAT), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.REPEAT), g.texImage2D(g.TEXTURE_2D, 0, g.RGB, 1, 1, 0, g.RGB, g.UNSIGNED_BYTE, new Uint8Array([255, 255, 255])), J = {
                    texture: j,
                    width: 1,
                    height: 1,
                    attach: t => (g.activeTexture(g.TEXTURE0 + t), g.bindTexture(g.TEXTURE_2D, j), t)
                }, Q = new Image, Q.onload = () => {
                    J.width = Q.width, J.height = Q.height, g.bindTexture(g.TEXTURE_2D, j), g.texImage2D(g.TEXTURE_2D, 0, g.RGB, g.RGB, g.UNSIGNED_BYTE, Q)
                }, Q.src = K, J),
                ea = new A(L, F),
                eu = new A(L, U),
                el = new A(L, b),
                ev = new A(L, w),
                ef = new A(L, O),
                ec = new A(L, B),
                em = new A(L, N),
                es = new A(L, I),
                eh = new A(L, P),
                eT = new A(L, M),
                ed = new A(L, X),
                eE = new A(L, C),
                eg = new A(L, G),
                eR = new A(L, z),
                ex = new A(L, Y),
                e0 = new A(L, H),
                ep = new A(L, V),
                e$ = new A(L, W);

            function eD() {
                let t = eN(i.SIM_RESOLUTION),
                    r = eN(i.DYE_RESOLUTION),
                    n = R.halfFloatTexType,
                    o = R.formatRGBA,
                    a = R.formatRG,
                    u = R.formatR,
                    v = R.supportLinearFiltering ? g.LINEAR : g.NEAREST;
                Z = null == Z ? e8(r.width, r.height, o.internalFormat, o.format, n, v) : eA(Z, r.width, r.height, o.internalFormat, o.format, n, v), ee = null == ee ? e8(t.width, t.height, a.internalFormat, a.format, n, v) : eA(ee, t.width, t.height, a.internalFormat, a.format, n, v), et = eS(t.width, t.height, u.internalFormat, u.format, n, g.NEAREST), er = eS(t.width, t.height, u.internalFormat, u.format, n, g.NEAREST), en = e8(t.width, t.height, u.internalFormat, u.format, n, g.NEAREST),
                    function t() {
                        let r = eN(i.BLOOM_RESOLUTION),
                            n = R.halfFloatTexType,
                            o = R.formatRGBA,
                            a = R.supportLinearFiltering ? g.LINEAR : g.NEAREST;
                        ei = eS(r.width, r.height, o.internalFormat, o.format, n, a), l.length = 0;
                        for (let u = 0; u < i.BLOOM_ITERATIONS; u++) {
                            let v = r.width >> u + 1,
                                f = r.height >> u + 1;
                            if (v < 2 || f < 2) break;
                            let c = eS(v, f, o.internalFormat, o.format, n, a);
                            l.push(c)
                        }
                    }()
            }

            function eS(t, r, n, i, o, a) {
                g.activeTexture(g.TEXTURE0);
                let u = g.createTexture();
                g.bindTexture(g.TEXTURE_2D, u), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, a), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, a), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE), g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE), g.texImage2D(g.TEXTURE_2D, 0, n, t, r, 0, i, o, null);
                let l = g.createFramebuffer();
                return g.bindFramebuffer(g.FRAMEBUFFER, l), g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, u, 0), g.viewport(0, 0, t, r), g.clear(g.COLOR_BUFFER_BIT), {
                    texture: u,
                    fbo: l,
                    width: t,
                    height: r,
                    attach: t => (g.activeTexture(g.TEXTURE0 + t), g.bindTexture(g.TEXTURE_2D, u), t)
                }
            }

            function e8(t, r, n, i, o, a) {
                let u = eS(t, r, n, i, o, a),
                    l = eS(t, r, n, i, o, a);
                return {
                    width: t,
                    height: r,
                    texelSizeX: 1 / t,
                    texelSizeY: 1 / r,
                    get read() {
                        return u
                    },
                    set read(e) {
                        u = e
                    },
                    get write() {
                        return l
                    },
                    set write(e) {
                        l = e
                    },
                    swap() {
                        let t = u;
                        u = l, l = t
                    }
                }
            }

            function eA(t, r, n, i, o, a, u) {
                var l, v, f, c, m, s, h;
                let T;
                return t.width == r && t.height == n || (t.read = (l = t.read, v = r, f = n, c = i, m = o, s = a, T = eS(v, f, c, m, s, h = u), ea.bind(), g.uniform1i(ea.uniforms.uTexture, l.attach(0)), k(T.fbo), T), t.write = eS(r, n, i, o, a, u), t.width = r, t.height = n, t.texelSizeX = 1 / r, t.texelSizeY = 1 / n), t
            }
            eD(), eU(1000);
            let e_ = Date.now(),
                eL = 0;

            function eF() {
                let t = eI(n.clientWidth),
                    r = eI(n.clientHeight);
                return (n.width != t || n.height != r) && (n.width = t, n.height = r, !0)
            }

            function eU(t) {
                for (let r = 0; r < t; r++) {
                }
            }

            function eb(t, r, o, a, u) {
                var l;
                let v;
                console.log(0.8,3.1,0.5)

                g.viewport(0, 0, ee.width, ee.height), eE.bind(), g.uniform1i(eE.uniforms.uTarget, ee.read.attach(0)), g.uniform1f(eE.uniforms.aspectRatio, n.width / n.height), g.uniform2f(eE.uniforms.point, t, r),
                 g.uniform3f(eE.uniforms.color, 12.0, 12.0, 0), g.uniform1f(eE.uniforms.radius, (l = i.SPLAT_RADIUS / 5000, v = n.width / n.height, v > 1 && (l *= v), l)), k(ee.write.fbo), ee.swap(), g.viewport(0, 0, Z.width, Z.height), g.uniform1i(eE.uniforms.uTarget, Z.read.attach(0)),
                  g.uniform3f(eE.uniforms.color, 0.05345554317, 0.0399115487501 , 0.1515487501), k(Z.write.fbo), Z.swap()
            }

            function ew(t, r, i, o) {
                t.id = r, t.down = !0, t.moved = !1, t.texcoordX = i / n.width, t.texcoordY = 1 - o / n.height, t.prevTexcoordX = t.texcoordX, t.prevTexcoordY = t.texcoordY, t.deltaX = 0, t.deltaY = 0, t.color = eB()
            }

            function ey(t, r, i) {
                var o, a;
                let u, l;
                t.moved = t.down, t.prevTexcoordX = t.texcoordX, t.prevTexcoordY = t.texcoordY, t.texcoordX = r / n.width, t.texcoordY = 1 - i / n.height, t.deltaX = (o = t.texcoordX - t.prevTexcoordX, u = n.width / n.height, u < 1 && (o *= u), o), t.deltaY = (a = t.texcoordY - t.prevTexcoordY, l = n.width / n.height, l > 1 && (a /= l), a)
            }

            function eO(t) {
                t.down = !1
            }

            function eB() {
                let t = function t(r, n, i) {
                    let o, a, u, l, v, f, c, m;
                    switch (f = i * (1 - n), c = i * (1 - (v = 6 * r - (l = Math.floor(6 * r))) * n), m = i * (1 - (1 - v) * n), l % 6) {
                        case 0:
                            o = i, a = m, u = f;
                            break;
                        case 1:
                            o = c, a = i, u = f;
                            break;
                        case 2:
                            o = f, a = i, u = m;
                            break;
                        case 3:
                            o = f, a = c, u = i;
                            break;
                        case 4:
                            o = m, a = f, u = i;
                            break;
                        case 5:
                            o = i, a = f, u = c
                    }
                    return {
                        r: o,
                        g: a,
                        b: u
                    }
                }(.057, .45, .023);
                return t.r *= .75, t.g *= .75, t.b *= .75, t
            }

            function eN(t) {
                let r = g.drawingBufferWidth / g.drawingBufferHeight;
                r < 1 && (r = 1 / r);
                let n = Math.round(t),
                    i = Math.round(t * r);
                return g.drawingBufferWidth > g.drawingBufferHeight ? {
                    width: i,
                    height: n
                } : {
                    width: n,
                    height: i
                }
            }

            function eI(t) {
                return Math.floor(t * (window.devicePixelRatio || 1))
            }(function t() {
                let r, o, v = (r = Date.now(), o = (r - e_) / 1e3, o = Math.min(o, .016666), e_ = r, o),
                    f;
                var c, m, s, h, T, d, E, x, p = null;
                let $, D, S;
                eF() && eD(), c = v, s = 0, h = 1, i.COLORFUL && (eL += c * i.COLOR_UPDATE_SPEED) >= 1 && (eL = (m = eL, f = 1 - s, 0 == f ? s : (m - s) % f + s), a.forEach(t => {
                        t.color = eB()
                    })), u.length > 0 && eU(u.pop()), a.forEach(t => {
                        var r;
                        let n, o;
                        t.moved && (t.moved = !1, n = (r = t).deltaX * i.SPLAT_FORCE, o = r.deltaY * i.SPLAT_FORCE, eb(r.texcoordX, r.texcoordY, n, o, r.color))
                    }), i.PAUSED || function t(r) {
                        g.disable(g.BLEND), g.viewport(0, 0, ee.width, ee.height), ex.bind(), g.uniform2f(ex.uniforms.texelSize, ee.texelSizeX, ee.texelSizeY), g.uniform1i(ex.uniforms.uVelocity, ee.read.attach(0)), k(er.fbo), e0.bind(), g.uniform2f(e0.uniforms.texelSize, ee.texelSizeX, ee.texelSizeY), g.uniform1i(e0.uniforms.uVelocity, ee.read.attach(0)), g.uniform1i(e0.uniforms.uCurl, er.attach(1)), g.uniform1f(e0.uniforms.curl, i.CURL), g.uniform1f(e0.uniforms.dt, r), k(ee.write.fbo), ee.swap(), eR.bind(), g.uniform2f(eR.uniforms.texelSize, ee.texelSizeX, ee.texelSizeY), g.uniform1i(eR.uniforms.uVelocity, ee.read.attach(0)), k(et.fbo), eu.bind(), g.uniform1i(eu.uniforms.uTexture, en.read.attach(0)), g.uniform1f(eu.uniforms.value, i.PRESSURE), k(en.write.fbo), en.swap(), ep.bind(), g.uniform2f(ep.uniforms.texelSize, ee.texelSizeX, ee.texelSizeY), g.uniform1i(ep.uniforms.uDivergence, et.attach(0));
                        for (let n = 0; n < i.PRESSURE_ITERATIONS; n++) g.uniform1i(ep.uniforms.uPressure, en.read.attach(1)), k(en.write.fbo), en.swap();
                        e$.bind(), g.uniform2f(e$.uniforms.texelSize, ee.texelSizeX, ee.texelSizeY), g.uniform1i(e$.uniforms.uPressure, en.read.attach(0)), g.uniform1i(e$.uniforms.uVelocity, ee.read.attach(1)), k(ee.write.fbo), ee.swap(), eg.bind(), g.uniform2f(eg.uniforms.texelSize, ee.texelSizeX, ee.texelSizeY), R.supportLinearFiltering || g.uniform2f(eg.uniforms.dyeTexelSize, ee.texelSizeX, ee.texelSizeY);
                        let o = ee.read.attach(0);
                        g.uniform1i(eg.uniforms.uVelocity, o), g.uniform1i(eg.uniforms.uSource, o), g.uniform1f(eg.uniforms.dt, r), g.uniform1f(eg.uniforms.dissipation, i.VELOCITY_DISSIPATION), k(ee.write.fbo), ee.swap(), g.viewport(0, 0, Z.width, Z.height), R.supportLinearFiltering || g.uniform2f(eg.uniforms.dyeTexelSize, Z.texelSizeX, Z.texelSizeY), g.uniform1i(eg.uniforms.uVelocity, ee.read.attach(0)), g.uniform1i(eg.uniforms.uSource, Z.read.attach(1)), g.uniform1f(eg.uniforms.dissipation, i.DENSITY_DISSIPATION), k(Z.write.fbo), Z.swap()
                    }(v), i.BLOOM && function t(r, n) {
                        if (l.length < 2) return;
                        let o = n;
                        g.disable(g.BLEND), eh.bind();
                        let a = i.BLOOM_THRESHOLD * i.BLOOM_SOFT_KNEE + 1e-4,
                            u = i.BLOOM_THRESHOLD - a;
                        g.uniform3f(eh.uniforms.curve, u, 2 * a, .25 / a), g.uniform1f(eh.uniforms.threshold, i.BLOOM_THRESHOLD), g.uniform1i(eh.uniforms.uTexture, r.attach(0)), g.viewport(0, 0, o.width, o.height), k(o.fbo), eT.bind();
                        for (let v = 0; v < l.length; v++) {
                            let f = l[v];
                            g.uniform2f(eT.uniforms.texelSize, 1 / o.width, 1 / o.height), g.uniform1i(eT.uniforms.uTexture, o.attach(0)), g.viewport(0, 0, f.width, f.height), k(f.fbo), o = f
                        }
                        g.blendFunc(g.ONE, g.ONE), g.enable(g.BLEND);
                        for (let c = l.length - 2; c >= 0; c--) {
                            let m = l[c];
                            g.uniform2f(eT.uniforms.texelSize, 1 / o.width, 1 / o.height), g.uniform1i(eT.uniforms.uTexture, o.attach(0)), g.viewport(0, 0, m.width, m.height), k(m.fbo), o = m
                        }
                        g.disable(g.BLEND), ed.bind(), g.uniform2f(ed.uniforms.texelSize, 1 / o.width, 1 / o.height), g.uniform1i(ed.uniforms.uTexture, o.attach(0)), g.uniform1f(ed.uniforms.intensity, i.BLOOM_INTENSITY), g.viewport(0, 0, n.width, n.height), k(n.fbo)
                    }(Z.read, ei), null != p && i.TRANSPARENT ? g.disable(g.BLEND) : (g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA), g.enable(g.BLEND)), $ = null == p ? g.drawingBufferWidth : p.width, D = null == p ? g.drawingBufferHeight : p.height, g.viewport(0, 0, $, D), S = null == p ? null : p.fbo, i.TRANSPARENT || (d = S, E = (T = i.BACK_COLOR, {
                        r: T.r / 255,
                        g: T.g / 255,
                        b: T.b / 255
                    }), el.bind(), g.uniform4f(el.uniforms.color, E.r, E.g, E.b, 0), k(d)), null == p && i.TRANSPARENT && (x = S, ev.bind(), g.uniform1f(ev.uniforms.aspectRatio, n.width / n.height), k(x)),
                    function t(r, n, o) {
                        let a = i.SHADING ? i.BLOOM ? es : em : i.BLOOM ? ec : ef;
                        if (a.bind(), i.SHADING && g.uniform2f(a.uniforms.texelSize, 1 / n, 1 / o), g.uniform1i(a.uniforms.uTexture, Z.read.attach(0)), i.BLOOM) {
                            var u, l, v;
                            g.uniform1i(a.uniforms.uBloom, ei.attach(1)), g.uniform1i(a.uniforms.uDithering, eo.attach(2));
                            let f = (u = eo, l = n, v = o, {
                                x: l / u.width,
                                y: v / u.height
                            });
                            g.uniform2f(a.uniforms.ditherScale, f.x, f.y)
                        }
                        k(r)
                    }(S, $, D), requestAnimationFrame(t)
            })(), n.addEventListener("mouseover", t => {
                let r = eI(t.offsetX),
                    n = eI(t.offsetY);
                ew(a[0], -1, r, n)
            }), n.addEventListener("mousemove", t => {
                let r = eI(t.offsetX),
                    n = eI(t.offsetY);
                ey(a[0], r, n)
            }), window.addEventListener("mouseout", () => {
                eO(a[0])
            }), n.addEventListener("touchstart", t => {
                t.preventDefault();
                let r = t.targetTouches;
                for (let n = 0; n < r.length; n++) {
                    n >= a.length && a.push(new o);
                    let i = eI(r[n].pageX),
                        u = eI(r[n].pageY);
                    ew(a[n], r[n].identifier, i, u)
                }
            }), n.addEventListener("touchmove", t => {
                t.preventDefault();
                let r = t.targetTouches;
                for (let n = 0; n < r.length; n++) {
                    let i = eI(r[n].pageX),
                        o = eI(r[n].pageY);
                    ey(a[n], i, o)
                }
            }, !1), window.addEventListener("touchend", t => {
                let r = t.changedTouches;
                for (let n = 0; n < r.length; n++)
                    for (let i = 0; i < a.length; i++) r[n].identifier == a[i].id && eO(a[i])
            })
        }
        window.removeEventListener("load", t)
    }
    window.addEventListener("load", t)
}();