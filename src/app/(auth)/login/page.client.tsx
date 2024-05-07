1 'use client'
2 import { useState, FormEvent, ChangeEvent } from 'react'
3 import Link from 'next/link'
4 import {
5   SiGithub,
6   SiDiscord,
7   SiApple,
8   SiGoogle,
9   SiSpotify,
10   SiMicrosoft,
11   SiTwitch,
12 } from '@icons-pack/react-simple-icons'
13 import { Button } from '@/components/ui/button'
14 import { useRouter } from 'next/navigation'
15 import {
16   signInWithApple,
17   signInWithDiscord,
18   signInWithGithub,
19   signInWithGoogle,
20   signInWithMicrosoft,
21   signInWithSpotify,
22   signInWithTwitch,
23 } from '@/utils/actions/oauth-actions'
24 import { useToast } from '@/components/ui/use-toast'
25 import { Label } from '@/components/ui/label'
26 import { Input } from '@/components/ui/input'
27 import { Checkbox } from '@/components/ui/checkbox'
28 import { createUser } from '@/utils/actions/login-actions'
29 
30 export default function Login() {
31   const [data, setData] = useState<{
32     email: string,
33     password: string,
34     username: string
35   }>({
36     email: '',
37     password: '',
38     username: '',
39   })
40   const [acceptedTerms, setAcceptedTerms] = useState<boolean>(false)
41   const [isRegistering, setIsRegistering] = useState<boolean>(false)
42   const router = useRouter()
43   const { toast } = useToast()
44 
45   const handleEmailLogin = async (e: FormEvent<HTMLFormElement>) => {
46     e.preventDefault()
47 
48     if (isRegistering) {
49       const body = {
50         email: data.email,
51         password: data.password,
52         username: data.username,
53       }
54 
55       const response = await createUser(body)
56 
57       if (response.code === 400) {
58         toast({
59           title: 'Error',
60           description: 'Invalid E-Mail or password provided.',
61           variant: 'destructive',
62         })
63       } else if (response.code === 401) {
64         toast({
65           title: 'Error',
66           description: 'E-Mail or Password incorrect.',
67           variant: 'destructive',
68         })
69       } else if (response.code === 409) {
70         toast({
71           title: 'Error',
72           description: 'E-Mail already in use.',
73           variant: 'destructive',
74         })
75       } else if (response.code === 429) {
76         toast({
77           title: 'Error',
78           description: 'Too many requests, please try again later.',
79           variant: 'destructive',
80         })
81       }
82 
83       router.push('/account')
84     } else {
85       const response = await fetch('/api/user/signin', {
86         method: 'POST',
87         headers: {
88           'Content-Type': 'application/json',
89         },
90         body: JSON.stringify({
91           email: data.email,
92           password: data.password,
93         }),
94       })
95       console.log(response)
96 
97       if (!response.ok) {
98         const data = await response.json()
99         if (data.error.type == 'user_invalid_credentials') {
100           toast({
101             title: 'Error',
102             description: 'E-Mail or Password incorrect.',
103             variant: 'destructive',
104           })
105         } else if (data.error.type == 'user_blocked') {
106           toast({
107             title: 'Error',
108             description: 'User is blocked.',
109             variant: 'destructive',
110           })
111         }
112       }
113 
114       router.push('/account')
115     }
116   }
117 
118   const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
119     const { name, value } = e.target
120     setData(prevData => ({ ...prevData, [name]: value }))
121   }
122 
123   return (
124     <>
125       <div className="lines">
126         <div className="line" />
127         <div className="line" />
128         <div className="line" />
129       </div>
130       <Button className={'m-8 absolute z-10'} onClick={() => router.push('/')}>
131         Home
132       </Button>
133       <div className="flex flex-1 justify-center items-center absolute inset-0">
134         {/* Add justify-center and items-center here */}
135         <div className="mx-auto mt-14 min-w-1/3 rounded-2xl p-8 dark:bg-[#04050a]/85 dark:ring-white">
136           <div className={'text-center'}>
137             <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight">
138               Welcome to Headpat!
139             </h2>
140             <p className="mt-2 text-sm leading-6 text-gray-500">
141               {isRegistering ? 'Already registered?' : 'Not yet registered?'}{' '}
142               <Link
143                 href="#"
144                 onClick={() => setIsRegistering(!isRegistering)}
145                 className="font-semibold text-indigo-600 hover:text-indigo-500"
146               >
147                 Click here!
148               </Link>
149             </p>
150           </div>
151 
152           <div className="mt-10">
153             <div>
154               <form
155                 action="#"
156                 method="POST"
157                 className="space-y-6"
158                 onSubmit={handleEmailLogin}
159               >
160                 <div key="1" className="mx-auto max-w-4xl p-6 space-y-6">
161                   <div className="space-y-4">
162                     {isRegistering && (
163                       <>
164                         <div className="space-y-2">
165                           <Label className="flex items-center" htmlFor="email">
166                             Username
167                             <span className="ml-1 text-red-500">*</span>
168                           </Label>
169                           <Input
170                             id="username"
171                             name="username"
172                             required
173                             type="username"
174                             onChange={handleInputChange}
175                           />
176                         </div>
177                       </>
178                     )}
179                     <div className="space-y-2">
180                       <Label className="flex items-center" htmlFor="email">
181                         Email
182                         <span className="ml-1 text-red-500">*</span>
183                       </Label>
184                       <Input
185                         id="email"
186                         name="email"
187                         placeholder="j@example.com"
188                         required
189                         type="email"
190                         onChange={handleInputChange}
191                       />
192                     </div>
193                     <div className="space-y-2">
194                       <Label className="flex items-center" htmlFor="password">
195                         Password
196                         <span className="ml-1 text-red-500">*</span>
197                       </Label>
198                       <Input
199                         id="password"
200                         name="password"
201                         required
202                         type="password"
203                         minLength={8}
204                         onChange={handleInputChange}
205                       />
206                     </div>
207                     <div className="space-y-2">
208                       <div className="flex items-center">
209                         <div className="space-y-2">
210                           <div className="flex items-center space-x-2">
211                             <Checkbox
212                               id="terms"
213                               name="terms"
214                               required
215                               onCheckedChange={() =>
216                                 setAcceptedTerms(!acceptedTerms)
217                               }
218                             />
219                             <Label className="leading-none" htmlFor="terms">
220                               I agree to the{' '}
221                               <Link className="underline" href="#">
222                                 terms and conditions
223                               </Link>
224                               <span className="ml-1 text-red-500">*</span>
225                             </Label>
226                           </div>
227                         </div>
228                       </div>
229                     </div>
230                     <Button disabled={!acceptedTerms} className="w-full">
231                       {isRegistering ? 'Register' : 'Login'}
232                     </Button>
233                   </div>
234                 </div>
235               </form>
236             </div>
237 
238             <div className="mt-8">
239               <div className="relative">
240                 <div
241                   className="absolute inset-0 flex items-center"
242                   aria-hidden="true"
243                 >
244                   <div className="w-full border-t border-gray-200" />
245                 </div>
246                 <div className="relative flex justify-center text-sm font-medium leading-6">
247                   <span className="rounded-xl bg-white px-6 text-gray-900">
248                     Or continue with
249                   </span>
250                 </div>
251               </div>
252 
253               <div className="mt-6 grid grid-cols-2 gap-4">
254                 <form action={signInWithDiscord}>
255                   <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#5865F2] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D9BF0] dark:border-white/20">
256                     <SiDiscord className={'h-5'} />
257                     <span className="text-sm font-semibold leading-6">
258                       Discord
259                     </span>
260                   </button>
261                 </form>
262 
263                 <form action={signInWithGithub}>
264                   <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#24292F] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
265                     <SiGithub className={'h-5'} />
266                     <span className="text-sm font-semibold leading-6">
267                       GitHub
268                     </span>
269                   </button>
270                 </form>
271 
272                 <form action={signInWithApple}>
273                   <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#000000] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
274                     <SiApple className={'h-5'} />
275                     <span className="text-sm font-semibold leading-6">
276                       Apple
277                     </span>
278                   </button>
279                 </form>
280 
281                 <form action={signInWithGoogle}>
282                   <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#131314] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
283                     <SiGoogle className={'h-4'} />
284 
285                     <span className="text-sm font-semibold leading-6">
286                       Google
287                     </span>
288                   </button>
289                 </form>
290 
291                 <form action={signInWithSpotify}>
292                   <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#1DB954] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
293                     <SiSpotify className={'h-5'} />
294                     <span className="text-sm font-semibold leading-6">
295                       Spotify
296                     </span>
297                   </button>
298                 </form>
299 
300                 <form action={signInWithMicrosoft}>
301                   <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#01A6F0] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
302                     <SiMicrosoft className={'h-5'} />
303                     <span className="text-sm font-semibold leading-6">
304                       Microsoft
305                     </span>
306                   </button>
307                 </form>
308 
309                 <form action={signInWithTwitch}>
310                   <button className="flex w-full items-center justify-center gap-3 rounded-md border border-black/20 bg-[#6441A5] px-3 py-1.5 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F] dark:border-white/20">
311                     <SiTwitch className={'h-5'} />
312                     <span className="text-sm font-semibold leading-6">
313                       Twitch
314                     </span>
315                   </button>
316                 </form>
317               </div>
318             </div>
319           </div>
320         </div>
321       </div>
322     </>
323   )
324 }
