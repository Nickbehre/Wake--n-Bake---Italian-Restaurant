'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Send, Loader2 } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

type FormData = {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

export default function ContactForm() {
  const { t } = useLanguage()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const formSchema = z.object({
    name: z.string().min(2, t('form.nameError')),
    email: z.string().email(t('form.emailError')),
    phone: z.string().optional(),
    subject: z.string().min(1, t('form.subjectError')),
    message: z.string().min(10, t('form.messageError')),
  })

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
      toast.success(t('form.success'))
      reset()
    } catch (error) {
      toast.error(t('form.error'))
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
            {t('form.name')} *
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            className="w-full px-4 py-3 border-2 border-espresso/20 focus:border-crust outline-none transition-colors bg-white"
            placeholder={t('form.namePlaceholder')}
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
            {t('form.email')} *
          </label>
          <input
            type="email"
            id="email"
            {...register('email')}
            className="w-full px-4 py-3 border-2 border-espresso/20 focus:border-crust outline-none transition-colors bg-white"
            placeholder={t('form.emailPlaceholder')}
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
            {t('form.phone')}
          </label>
          <input
            type="tel"
            id="phone"
            {...register('phone')}
            className="w-full px-4 py-3 border-2 border-espresso/20 focus:border-crust outline-none transition-colors bg-white"
            placeholder={t('form.phonePlaceholder')}
          />
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block font-montserrat font-bold mb-2 text-espresso"
          >
            {t('form.subject')} *
          </label>
          <select
            id="subject"
            {...register('subject')}
            className="w-full px-4 py-3 border-2 border-espresso/20 focus:border-crust outline-none transition-colors bg-white"
          >
            <option value="">{t('form.subjectPlaceholder')}</option>
            <option value="bestelling">{t('form.subjectOrder')}</option>
            <option value="catering">{t('form.subjectCatering')}</option>
            <option value="feedback">{t('form.subjectFeedback')}</option>
            <option value="vacature">{t('form.subjectVacancy')}</option>
            <option value="anders">{t('form.subjectOther')}</option>
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
          {t('form.message')} *
        </label>
        <textarea
          id="message"
          {...register('message')}
          rows={5}
          className="w-full px-4 py-3 border-2 border-espresso/20 focus:border-crust outline-none transition-colors bg-white resize-none"
          placeholder={t('form.messagePlaceholder')}
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
            {t('form.submitting')}
          </>
        ) : (
          <>
            {t('form.submit')}
            <Send className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  )
}
