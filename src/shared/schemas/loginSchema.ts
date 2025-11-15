import { z } from 'zod'

/**
 * Schema de validación para el formulario de login
 */
export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'El usuario es requerido')
    .email('Formato de email inválido')
    .refine(
      (email) => email.endsWith('@nauta.com.cu') || email.endsWith('@nauta.co.cu'),
      'El usuario debe terminar en @nauta.com.cu o @nauta.co.cu'
    ),

  password: z.string().min(4, 'La contraseña debe tener al menos 4 caracteres'),

  remember: z.boolean(),
})

/**
 * Tipo inferido desde el schema
 */
export type LoginFormData = z.infer<typeof loginSchema>
