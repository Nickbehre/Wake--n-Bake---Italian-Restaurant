'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Send, Loader2 } from 'lucide-react'

const formSchema = z.object({
  name: z.string().min(2, 'Naam moet minimaal 2 karakters zijn'),
  email: z.string().email('Ongeldig email adres'),
  phone: z.string().optional(),
  subject: z.string().min(1, 'Selecteer een onderwerp'),
  message: z.string().min(10, 'Bericht moet minimaal 10 karakters zijn'),
})

type FormData = z.infer<typeof formSchema>

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)

    try {
      // Simulate API call - replace with actual form submission
      await new Promise((resolve) => setTimeout(resolve, 1500))

      console.log('Form data:', data)
      toast.success('Bericht verzonden! We nemen zo snel mogelijk contact op.')
      reset()
    } catch (error) {
      toast.error('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="name"
            className="block font-montserrat font-bold mb-2 text-espresso"
          >
            Naam *
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="w-full px-4 py-3 border-2 border-espresso/20 focus:border-crust outline-none transition-colors bg-white"
            placeholder="Jouw naam"
          />
          {errors.name && (
            <p className="text-tomato text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="email"
            className="block font-montserrat font-bold mb-2 text-espresso"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="w-full px-4 py-3 border-2 border-espresso/20 focus:border-crust outline-none transition-colors bg-white"
            placeholder="jouw@email.nl"
          />
          {errors.email && (
            <p className="text-tomato text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="phone"
            className="block font-montserrat font-bold mb-2 text-espresso"
          >
            Telefoon (optioneel)
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone')}
            className="w-full px-4 py-3 border-2 border-espresso/20 focus:border-crust outline-none transition-colors bg-white"
            placeholder="06 12345678"
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block font-montserrat font-bold mb-2 text-espresso"
          >
            Onderwerp *
          </label>
          <select
            id="subject"
            {...register('subject')}
            className="w-full px-4 py-3 border-2 border-espresso/20 focus:border-crust outline-none transition-colors bg-white"
          >
            <option value="">Selecteer een onderwerp</option>
            <option value="bestelling">Bestelling / Reservering</option>
            <option value="catering">Catering</option>
            <option value="feedback">Feedback</option>
            <option value="vacature">Vacature</option>
            <option value="anders">Anders</option>
          </select>
          {errors.subject && (
            <p className="text-tomato text-sm mt-1">{errors.subject.message}</p>
          )}
        </div>
      </div>

      <div>
        <label
          htmlFor="message"
          className="block font-montserrat font-bold mb-2 text-espresso"
        >
          Bericht *
        </label>
        <textarea
          id="message"
          {...register('message')}
          rows={5}
          className="w-full px-4 py-3 border-2 border-espresso/20 focus:border-crust outline-none transition-colors bg-white resize-none"
          placeholder="Vertel ons waarmee we je kunnen helpen..."
        />
        {errors.message && (
          <p className="text-tomato text-sm mt-1">{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-tomato hover:bg-tomato/90 text-white font-montserrat font-bold py-4 px-8 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Verzenden...
          </>
        ) : (
          <>
            Verstuur Bericht
            <Send className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  )
}
